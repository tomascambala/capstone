import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h2>Please log in to app</h2>

        <Button onClick={this.onLogin} size="huge" color="red">
          Log in
        </Button>
      </div>
    )
  }
}
