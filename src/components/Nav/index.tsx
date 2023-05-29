import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import routes from '../../routes';


interface Props {
  changePath: (path: string) => void;
}

class Nav extends React.Component <Props> {
  
  render() {
    const { changePath } = this.props;

    return (
      <nav className='nav'>
        <ul>
          <li>
            <Link to={`${routes.home}`}>На главную</Link>
          </li>
          <li>
            <Link onClick={()=> changePath(routes.profile)} to={`${routes.profile}`}>Профиль</Link>
          </li>
          <li>
            <Link onClick={()=> changePath(routes.registration)} to={`${routes.registration}`}>Регистрация</Link>
          </li>
          <li>
            <Link onClick={()=> changePath(routes.login)} to={`${routes.login}`}>Авторизация</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
