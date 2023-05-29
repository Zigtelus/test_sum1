import React, { ChangeEvent, FormEvent } from 'react';
import './index.scss';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserType, authenticateUser } from "../../redux/slices/users.slice";
import routes from '../../routes';

interface State {
  login: string;
  password: string;
  message: string;
  isRegistrationSuccessful: boolean;
}

interface Props {
  user: UserType | null;
  authenticateUser: (data: { login: string; password: string }) => void;
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
    const user: string | null = localStorage.getItem("authenticateUser");

    if (!!user) {
      this.setState({ message: 'Вы уже авторизованы', isRegistrationSuccessful: true });
      window.location.replace(`${this.baseUrl}${routes.profile}`);
    }
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as unknown as State);
  };

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { login, password } = this.state;

    if (!!login && !!password) {
      await this.props.authenticateUser({ login, password });
      this.setState({ login: '', password: '' });

      if (this.props.user === null) {
        this.setState({ message: 'Имя пользователя или пароль введены неверно', isRegistrationSuccessful: false });
      } else {
        localStorage.setItem('authenticateUser', JSON.stringify(this.props.user));
        this.setState({ message: 'Аутентификация прошла успешно', isRegistrationSuccessful: true }, () => {
          setTimeout(() => {
            window.location.replace(`${this.baseUrl}${routes.profile}`);
          }, 500); // Задержка перед перенаправлением страницы
        });
      }
    } else {
      this.setState({ message: 'Вы ввели не все данные' });
    }
  };

  render() {
    const { login, password, message, isRegistrationSuccessful } = this.state;
    const { user } = this.props;

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
