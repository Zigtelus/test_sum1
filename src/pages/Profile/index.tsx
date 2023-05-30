import React from "react";
import './index.scss';
import { connect } from "react-redux";
import { UserType, authenticateUser } from "../../redux/slices/users.slice";
import routes from "../../routes";
import { RootState } from "../../redux/store";


interface Props {
  changePath: (path: string) => void;
  user: UserType | null;
  authenticateUser: (user: Omit<UserType, 'name' | 'userId'> | null)=> void;
  isUserRegistered: boolean;
}

interface State {
  isRegistrationSuccessful: boolean;
}

class Profile extends React.Component<Props, State> {

  componentDidMount = async () => {
    
    const {changePath, isUserRegistered} = this.props

    // первая проверка авторизации пользователя, при монтировании компоненты
    if (!isUserRegistered) {
      changePath(routes.login)
    }
  };

  handleLogout = async () => {
    // удаление информации о авторизации пользователя
    localStorage.removeItem("authenticateUser");
    this.props.authenticateUser(null);

    this.setState({isRegistrationSuccessful: false});
    this.props.changePath(routes.login)
  };

  render() {
    const { user } = this.props
    
    return (
      <div>
        {
          !!user 
          ? 
          <>
            <h1> Здравствуйте, {user.name}</h1>
            {
              !!user.name && 
              <button onClick={this.handleLogout}>logout</button>
            }
          </> 
          :
          <h1>Вы не авторизованы</h1>
        }
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.usersReducer.authenticateUser
});

const mapDispatchToProps = {
  authenticateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
