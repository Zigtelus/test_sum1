import React from "react";
import './index.scss';
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { UserType, authenticateUser } from "../../redux/slices/users.slice";
import routes from "../../routes";


interface Props {
  authenticateUser: (data: null) => void; // разлогин
}

class Profile extends React.Component<Props> {
  componentDidMount = async () => {
    const baseUrl = window.location.protocol + '//' + window.location.host;
    const userString = localStorage.getItem("authenticateUser");
    const user: UserType | null = userString ? JSON.parse(userString) : null;
    
    // первая проверка авторизации, при монтировании
    !!user || (window.location.replace(`${baseUrl}${routes.login}`)); // хук useNavigate - не совместим с классовой компонентой
  };

  handleLogout = () => {
    localStorage.removeItem("authenticateUser");
    this.props.authenticateUser(null);
  };

  render() {
    const userString = localStorage.getItem("authenticateUser");
    const user: UserType | null = userString ? JSON.parse(userString) : null;

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

const mapDispatchToProps = {
  authenticateUser
};

export default connect(null, mapDispatchToProps)(Profile);
