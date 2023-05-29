import React, { ChangeEvent, FormEvent } from 'react';
import './index.scss';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserType, authenticateUser } from "../../redux/slices/users.slice";


interface State {
  // типы данных для хранения значений полей формы
  login: string;
  password: string;
  message: string;
}

interface Props {
  user: UserType | null; // авторизованный пользователь
  authenticateUser: (data: { login: string; password: string }) => void;
}

class LogIn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      message: ''
    };
  }

  componentDidMount = async () => {
    const user: string | null = localStorage.getItem("authenticateUser");

    // первая проверка авторизации, при монтировании
    if (!!user) {
      (window.location.replace('/profile')); // хук useNavigate - не совместим с классовой компонентой
      this.setState({message: 'Вы уже авторизованы'})
    }
  };

  // Обработчик изменений полей формы
  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  // Обработчик отправки формы
  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { login, password } = this.state;

    // проверка на ввод логина и пароля
    if (!!login && !!password) {
      await this.props.authenticateUser(this.state); // отправка данных в редакс, для аутентификации пользователя
      this.setState({ login: '', password: '' });
      
      // проверка аутентификации
      if (this.props.user === null) {
        this.setState({ message: 'Имя пользователя или пароль введены неверно' });
      } else {
        localStorage.setItem('authenticateUser', JSON.stringify(this.props.user));
        this.setState({ message: 'Аутентификация прошла успешно' });
        window.location.replace('/profile');
      }

    } else {
      this.setState(state => ({ ...state, message: 'Вы ввели не все данные' }));
    }
  };

  render() {
    const { login, password, message } = this.state;
    const { user } = this.props;

    return (
      <div>
        <h1>Log In</h1>
        {
          !user
          ? 
          <>
            {!!message && <span>{message}</span>}
            <form className="login" onSubmit={this.handleSubmit}>
              <label htmlFor="login">Login:</label>
              <input
                type="text"
                id="login"
                name="login"
                value={login}
                onChange={this.handleChange}
              />
  
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
  
              <button type="submit">Log In</button>
            </form>
          </> 
          :
          <span>{message}</span>
        }
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.usersReducer.authenticateUser,
});

const mapDispatchToProps = {
  authenticateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
