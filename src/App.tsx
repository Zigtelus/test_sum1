import React from 'react';
import './App.scss';
import Nav from './components/Nav';
import Main from './components/Main';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';
import Home from './pages/Home';
import AuthRegistration from './pages/AuthRegistration';

interface Props {};

interface State {
  path: string;
}

class App extends React.Component <Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      path: window.location.pathname,
    };
  }

  // изменение стейта при смене одного из трех маршрутов
  changePath =(path: string)=> {
    window.history.pushState(null, '', path); // изменение адрессной строки с сохранением в истории
    this.setState({path: path})
  }


  render() {
    const { path } = this.state;

    return (
      <div className="App">
        <Nav changePath={this.changePath} />
        <Main>
          <Routes>
            <Route path={routes.home} element={ <Home /> } />
            <Route path={routes.profile} element={ <AuthRegistration changePath={this.changePath} path={path} /> } />
            <Route path={routes.registration} element={ <AuthRegistration changePath={this.changePath} path={path} /> } />
            <Route path={routes.login} element={ <AuthRegistration changePath={this.changePath} path={path} /> } />
          </Routes>
        </Main>
      </div>
    );
  }
}

export default App;
