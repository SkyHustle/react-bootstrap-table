require('./demo.css');
import React from 'react';
import App from './app';
import CryptoStream from './CryptoStream';

class Demo extends React.Component {
  render() {
    return (
      <div className='col-md-offset-1 col-md-8'>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <App />
            <CryptoStream />
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
