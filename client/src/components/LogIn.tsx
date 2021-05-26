import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'
import { authConfig } from '../config'

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
        <h1 style={{ textAlign: 'center', marginBottom: '20%', color: "#a8323c" }}>WELCOME IN IMAGE APP</h1>
      <div style={{ margin: 'auto', width: '290px' }}>
        <h1>Please log in or Sign Up </h1>

        <Button style={{ width: '290px', backgroundColor: "#a8323c", color: 'white'}} onClick={this.onLogin} size="huge">
          Log in
        </Button>
      </div>
      </div>

    )
  }
}
