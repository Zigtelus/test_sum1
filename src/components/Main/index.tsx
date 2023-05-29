import React, { ReactNode } from 'react';
import './index.scss';


interface Props {
  children: ReactNode;
}

class Main extends React.Component<Props> {

  render() {
    const { children } = this.props;

    return (
      <main>
        {children}
      </main>
    );
  }
}

export default Main;
