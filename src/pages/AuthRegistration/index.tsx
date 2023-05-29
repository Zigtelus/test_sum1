import React from 'react';
import LogIn from '../LogIn';
import Profile from '../Profile';
import Registration from '../Registration';
import routes from '../../routes';
import { connect } from 'react-redux';
import { authenticateUser, addUsers, UserType } from '../../redux/slices/users.slice';
import { RootState } from '../../redux/store';


interface State {
  path: string;
  isUserRegistered: boolean;
}

interface Props {
  path: string;
  changePath: (path: string) => void;

  // пропсы из стора
  user: UserType | null;
  authenticateUser: (user: UserType) => void,
  addUsers: (users: UserType[]) => void;
}

class AuthRegistration extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      path: window.location.pathname,
      isUserRegistered: false,
    }
  }

  componentDidMount =()=> {
    // получение данных о зарегистрированных пользователях
    const users: string | null = localStorage.getItem("users")
    if (!!users) {
      // отправка зареганых пользователей в стор
      this.props.addUsers(JSON.parse(users))
    }

    // проверка на наличи авторизованного пользователя
    const user: string | null = localStorage.getItem("authenticateUser")
    if (!!user) {
      // отправка авторизованного пользователя в стор
      this.props.authenticateUser(JSON.parse(user))

      this.setState({isUserRegistered: true})
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {

    // проверка на изменение pathname
    if (prevState.path !== this.state.path) {
      this.props.changePath(window.location.pathname);
    }

    // проверка на изменение user
    if (prevProps.user !== this.props.user) {
      !!this.props.user ? this.setState({isUserRegistered: true}) : this.setState({isUserRegistered: false})
    }
  }

  render() {

    const { changePath } = this.props

    return <>
      {this.props.path === routes.login && <LogIn changePath={changePath} isUserRegistered={this.state.isUserRegistered}/>}
      {this.props.path === routes.profile && <Profile changePath={changePath} isUserRegistered={this.state.isUserRegistered}/>}
      {this.props.path === routes.registration && <Registration changePath={changePath} isUserRegistered={this.state.isUserRegistered}/>}
    </>
  }
}


const mapStateToProps = (state: RootState) => ({
  user: state.usersReducer.authenticateUser
});

const mapDispatchToProps = {
  authenticateUser,
  addUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthRegistration);