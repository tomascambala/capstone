import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, Button } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditImage } from './components/EditImage'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Images } from './components/Images'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10%'  }}>
          <Button style={{ backgroundColor: "#a8323c", color: 'white' }}> <Link style={{ color: "white" }} to="/">Home</Link> </Button>
          <Button style={{ backgroundColor: "#a8323c", color: 'white'}}> {this.logInLogOutButton()}</Button>
        </div>
      )
    }
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item style={{ color: 'white'}} name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item style={{ color: 'white'}} name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Images {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/images/:imageId/edit"
          exact
          render={props => {
            return <EditImage {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
