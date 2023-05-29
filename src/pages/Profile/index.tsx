import React from "react";
import './index.scss';
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { UserType, authenticateUser } from "../../redux/slices/users.slice";


interface Props {
  user: UserType | null; // авторизованный пользователь
  authenticateUser: (data: null) => void; // разлогин
}

class Profile extends React.Component<Props> {

  componentDidMount = async () => {
    const user: string | null = localStorage.getItem("authenticateUser");
    
    // первая проверка авторизации, при монтировании
    !!user || (window.location.replace('/login')); // хук useNavigate - не совместим с классовой компонентой
  };

  handleLogout = () => {
    localStorage.removeItem("authenticateUser");
    this.props.authenticateUser(null);
  };

  render() {
    return (
      <div>
        {
          !!this.props.user 
          ? 
          <>
            <h1> Здравствуйте, {this.props.user.name}</h1>
            {
              !!this.props.user?.name && 
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
  user: state.usersReducer.authenticateUser,
});

const mapDispatchToProps = {
  authenticateUser
};


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
