import React from 'react';
import './App.scss';
import Nav from './components/Nav';
import Main from './components/Main';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';
import Registration from './pages/Registration';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LogIn from './pages/LogIn';
import { connect } from 'react-redux';
import { UserType, authenticateUser, addUsers } from "./redux/slices/users.slice";

interface Props {
  addUsers: (data: any) => void,
  authenticateUser: (data: UserType) => void,
};

class App extends React.Component <Props> {


  componentDidMount = async () => {

    // проверка зарегистриарованных пользователей
    const users: string | null = localStorage.getItem("users")

    !!users && 
    await this.props.addUsers(JSON.parse(users))

    // проверка на наличи авторизованного пользователя
    const user: string | null = localStorage.getItem("authenticateUser")

    !!user && 
    await this.props.authenticateUser(JSON.parse(user))
  }


  render() {
    return (
      <div className="App">
        <Nav />
        <Main>
          <Routes>
            <Route path={routes.home} element={ <Home/> } />
            <Route path={routes.profile} element={ <Profile/> } />
            <Route path={routes.registration} element={ <Registration/> } />
            <Route path={routes.login} element={ <LogIn/> } />
          </Routes>
        </Main>
      </div>
    );
  }
};

const mapDispatchToProps = {
  authenticateUser,
  addUsers
};

export default connect(null, mapDispatchToProps)(App);
