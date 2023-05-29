import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import routes from '../../routes';


interface Props {}

class Nav extends React.Component <Props> {


  render() {
    return (
      <nav className='nav'>
        <ul>
          <li>
            <Link to={`${routes.home}`}>На главную</Link>
          </li>
          <li>
            <Link to={`${routes.profile}`}>Профиль</Link>
          </li>
          <li>
            <Link to={`${routes.registration}`}>Регистрация</Link>
          </li>
          <li>
            <Link to={`${routes.login}`}>Авторизация</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
