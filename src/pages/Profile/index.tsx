import React from "react";
import './index.scss';
import { connect } from "react-redux";
import { UserType, authenticateUser } from "../../redux/slices/users.slice";
import routes from "../../routes";


interface Props {
  authenticateUser: (data: null) => void; 
}

interface State {
  isRegistrationSuccessful: boolean;
}

class Profile extends React.Component<Props, State> {
  baseUrl: string = window.location.protocol + '//' + window.location.host;

  // получение данных о авторизации пользователя
  userString: string | null= localStorage.getItem("authenticateUser") 

  state: State = {
    isRegistrationSuccessful: false
  };

  componentDidMount = async () => {
    const user: UserType | null = this.userString ? JSON.parse(this.userString) : null;
    
    // первая проверка авторизации пользователя, при монтировании компоненты
    !!user || (window.location.replace(`${this.baseUrl}${routes.login}`)); // хук useNavigate - не совместим с классовой компонентой
  };

  handleLogout = async () => {
    // удаление информации о авторизации пользователя
    localStorage.removeItem("authenticateUser");
    this.props.authenticateUser(null);

    this.setState({isRegistrationSuccessful: false});
    window.location.replace(`${this.baseUrl}${routes.login}`);
  };

  render() {
    // получение данных о авторизованным пользователе
    const user: UserType | null = this.userString ? JSON.parse(this.userString) : null; 

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
        {this.state.isRegistrationSuccessful && <p>Регистрация прошла успешно!</p>}
      </div>
    );
  }
}

const mapDispatchToProps = {
  authenticateUser
};

export default connect(null, mapDispatchToProps)(Profile);
