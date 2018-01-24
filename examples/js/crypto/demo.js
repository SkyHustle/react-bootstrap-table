require('./demo.css');
import React from 'react';
import App from './app';
import CryptoStream from './CryptoStream';

class Demo extends React.Component {
  render() {
    return (
      <div className='col-md-offset-1 col-md-10'>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <App />
          </div>
        </div>
        <CryptoStream />
      </div>
    );
  }
}

export default Demo;
