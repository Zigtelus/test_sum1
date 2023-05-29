import React, { ChangeEvent, FormEvent } from 'react';
import './index.scss';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserType, authenticateUser } from "../../redux/slices/users.slice";
import routes from '../../routes';

interface State {
  // Хранение значений полей формы входа
  login: string;
  password: string;
  message: string;

  isRegistrationSuccessful: boolean;
}

interface Props {
  // данные зарегистррованного пользователя
  user: UserType | null; 

  // отправка данных в стор о регистрации/разактивации пользователя
  authenticateUser: (data:  Omit<UserType, 'name' | 'userId'>) => void; 
}

class LogIn extends React.Component<Props, State> {
  baseUrl: string = window.location.protocol + '//' + window.location.host;

  constructor(props: Props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      message: '',
      isRegistrationSuccessful: false,
    };
  }

  componentDidMount = async () => {
    // получение данных о авторизованном пользователе
    const user: string | null = localStorage.getItem("authenticateUser"); 

    // Проверка авторизации при монтировании компонента
    if (!!user) {
      this.setState({ message: 'Вы уже авторизованы', isRegistrationSuccessful: true });
      window.location.replace(`${this.baseUrl}${routes.profile}`); // хук useNavigate - не совместим с классовой компонентой
    }
  };

  // Обработчик изменений полей формы входау
  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as unknown as State);
  };

  // Обработчик отправки формы входа
  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { login, password } = this.state;

    // Проверка наличия введенного логина и пароля
    if (!!login && !!password) {

      // отправка данных о пользователе в стор
      await this.props.authenticateUser({ login, password }); 

      this.setState({ login: '', password: '' });

      // Проверка результата аутентификации
      if (this.props.user === null) {
        this.setState({ message: 'Имя пользователя или пароль введены неверно', isRegistrationSuccessful: false });
      } else {

        // обновление информации о авторизации пользователя в localStorage 
        localStorage.setItem('authenticateUser', JSON.stringify(this.props.user)); 

        this.setState({ message: 'Аутентификация прошла успешно', isRegistrationSuccessful: true });

        // переадрессация на страницу профиля
        window.location.replace(`${this.baseUrl}${routes.profile}`); 
      }
    } else {
      this.setState({ message: 'Вы ввели не все данные' });
    }
  };

  render() {
    const { login, password, message, isRegistrationSuccessful } = this.state;

    return (
      <div>
        <h1>Log In</h1>
        {!isRegistrationSuccessful ? (
          <>
            {!!message && <span>{message}</span>}
            <form className="login" onSubmit={this.handleSubmit}>
              <label htmlFor="login">Login:</label>
              <input type="text" id="login" name="login" value={login} onChange={this.handleChange} />

              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" value={password} onChange={this.handleChange} />

              <button type="submit">Log In</button>
            </form>
          </>
        ) : (
          <span>{message}</span>
        )}
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
