import React, { ChangeEvent, FormEvent } from "react";
import './index.scss';
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { UserType, addNewUser, authenticateUser } from "../../redux/slices/users.slice";
import routes from "../../routes";


type ModifiedUserType = Omit<UserType, 'userId'>;

interface State {
  //типы данных для хранения значений полей формы
  name: string;
  login: string;
  password: string;
  passwordConfirmation: string;

  //типы данных для сообщений об ошибках формы
  errors: {
    name?: string;
    login?: string;
    password?: string;
    passwordConfirmation?: string;
  };

  isRegistrationSuccessful: boolean;
}

interface Props {
  users: ModifiedUserType[]; // список пользователей из Redux-хранилища.
  addNewUser: (user: ModifiedUserType) => void;
  user: UserType | null;
  authenticateUser: (data: UserType) => void;
}

class Registration extends React.Component<Props, State> {
  baseUrl: string = window.location.protocol + '//' + window.location.host;

  constructor(props: Props) {
    super(props);
    this.state = {
      name: "",
      login: "",
      password: "",
      passwordConfirmation: "",
      errors: {},
      isRegistrationSuccessful: false,
    };
  }

  componentDidMount = async () => {
    const user: string | null = localStorage.getItem("authenticateUser")
    
    // первая проверка авторизации, при монтировании
    if (!!user) {
      window.location.replace(`${this.baseUrl}${routes.profile}`); // хук useNavigate - не совместим с классовой компонентой
      this.setState({isRegistrationSuccessful: true});
    }
    
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const { user } = this.props;
    
    // первая проверка авторизации, при монтировании
    !!user && (window.location.replace(`${this.baseUrl}${routes.login}`)); // хук useNavigate - не совместим с классовой компонентой
  }

  // ввод новых изменений в state
  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as unknown as State);
  };

  // проверка валидации и отправка формы в стор
  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const { users } = this.props;
    e.preventDefault();

    // Валидация формы
    const errors: State["errors"] = {};

    // проверка ввода имени
    if (!this.state.name) {
      errors.name = "Поле Имя обязательно для заполнения";
    }

    // проверка ввода логина
    if (!this.state.login) {
      errors.login = "Поле Логин обязательно для заполнения";
    } else {
      const loginVerification = users.some((item: ModifiedUserType) => item.name === this.state.login); // поиск идентичного логина среди имеющихся юзеров
      loginVerification && (errors.login = "Данный логин занят");
    }

    // проверка ввода пассворда
    if (!this.state.password) {
      errors.password = "Поле Пароль обязательно для заполнения";
    }

    // проверка ввода пассворда второй раз и проверка совпадений с первым
    if (!this.state.passwordConfirmation) {
      errors.passwordConfirmation = "Поле Подтверждение пароля обязательно для заполнения";
    } else if (this.state.passwordConfirmation !== this.state.password) {
      errors.passwordConfirmation = "Пароль не совпадает";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      // Отправка данных на сервер
      const { name, login, password } = this.state;
      this.props.addNewUser({ name, login, password });
      this.setState({ isRegistrationSuccessful: true });

      // Сброс значений ключей
      this.setState({
        name: "",
        login: "",
        password: "",
        passwordConfirmation: "",
        errors: {},
      });
    }
  };

  render() {
    const { errors, isRegistrationSuccessful } = this.state;

    return (
      <div className="registration">
        {
          !!isRegistrationSuccessful 
          ? 
          <h1>Вы уже авторизованы</h1>
          :
          <div>
            <h1>Registration</h1>
  
            {
              isRegistrationSuccessful ?
              
              <div>
                <span>регистрация прошла успешно.</span>
                <div><button onClick={() => window.location.replace(`${this.baseUrl}${routes.login}`)}>перейти к авторизации</button></div>
                <div><button onClick={() => this.setState({ isRegistrationSuccessful: false })}>остаться здесь</button></div>
              </div> :
  
              <form className="form" onSubmit={this.handleSubmit}>
                <label htmlFor="name">Имя:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
                {errors.name && <span>{errors.name}</span>}
      
                <label htmlFor="login">Логин:</label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={this.state.login}
                  onChange={this.handleChange}
                />
                {errors.login && <span>{errors.login}</span>}
      
                <label htmlFor="password">Пароль:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
                {errors.password && <span>{errors.password}</span>}
      
                <label htmlFor="passwordConfirmation">Подтверждение пароля:</label>
                <input
                  type="password"
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  value={this.state.passwordConfirmation}
                  onChange={this.handleChange}
                />
                {errors.passwordConfirmation && <span>{errors.passwordConfirmation}</span>}
      
                <input type="submit" value="Отправить" />
              </form>
            }
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  users: state.usersReducer.data,
  user: state.usersReducer.authenticateUser
});

const mapDispatchToProps = {
  addNewUser,
  authenticateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
