import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Card,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image as ImageUI,
  Loader
} from 'semantic-ui-react'

import { createImage, deleteImage, getImages, patchImage } from '../api/images-api'
import Auth from '../auth/Auth'
import { Image } from '../types/Image'

interface ImagesProps {
  auth: Auth
  history: History
}

interface ImagesState {
  images: Image[]
  newImageName: string
  loadingImages: boolean
}

export class Images extends React.PureComponent<ImagesProps, ImagesState> {
  state: ImagesState = {
    images: [],
    newImageName: '',
    loadingImages: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newImageName: event.target.value })
  }

  onEditButtonClick = (imageId: string) => {
    this.props.history.push(`/images/${imageId}/edit`)
  }

  onImageCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newImage = await createImage(this.props.auth.getIdToken(), {
        name: this.state.newImageName,
        dueDate
      })
      this.setState({
        images: [...this.state.images, newImage],
        newImageName: ''
      })
    } catch {
      alert('Image creation failed')
    }
  }

  onImageDelete = async (imageId: string) => {
    try {
      await deleteImage(this.props.auth.getIdToken(), imageId)
      this.setState({
        images: this.state.images.filter(image => image.imageId != imageId)
      })
    } catch {
      alert('Image deletion failed')
    }
  }

  onImageCheck = async (pos: number) => {
    try {
      const image = this.state.images[pos]
      await patchImage(this.props.auth.getIdToken(), image.imageId, {
        name: image.name,
        dueDate: image.dueDate,
        done: !image.done
      })
      this.setState({
        images: update(this.state.images, {
          [pos]: { done: { $set: !image.done } }
        })
      })
    } catch {
      alert('Image deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const images = await getImages(this.props.auth.getIdToken())
      this.setState({
        images,
        loadingImages: false
      })
    } catch (e) {
      alert(`Failed to fetch images: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Gallery</Header>

        {this.renderCreateImageInput()}

        {this.renderImages()}
      </div>
    )
  }

  renderCreateImageInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'red',
              labelPosition: 'left',
              icon: 'add',
              content: 'Title of your image',
              onClick: this.onImageCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Share it with the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderImages() {
    if (this.state.loadingImages) {
      return this.renderLoading()
    }

    return this.renderImagesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading IMAGEs
        </Loader>
      </Grid.Row>
    )
  }

  renderImagesList() {
    return (
      <Grid padded>
        {this.state.images.map((image) => {
          return (
            <div key={image.imageId} style={{ marginBottom: '20px' }}>
              <Card  >
                {image.attachmentUrl && (
                  <ImageUI src={image.attachmentUrl} wrapped ui={false} />
                )}
                <Card.Content>
                  <Card.Header>{image.name}</Card.Header>
                  <Card.Meta>
                    <span className='date'>{image.dueDate}</span>
                  </Card.Meta>
                  <Card.Description>
                    <Button
                      icon
                      color="blue"
                      onClick={() => this.onEditButtonClick(image.imageId)}
                    >
                      <Icon name="pencil" />
                    </Button>
                    <Button
                      icon
                      color="red"
                      onClick={() => this.onImageDelete(image.imageId)}
                    >
                      <Icon name="delete" />
                    </Button>
                  </Card.Description>
                </Card.Content>
              </Card>
            </div>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
