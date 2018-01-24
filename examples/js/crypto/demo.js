require('./demo.css');
import React from 'react';
import App from './app';
// import CryptoStream from './CryptoStream';

class Demo extends React.Component {
  render() {
    return (
      <div className='col-md-offset-1 col-md-10'>
        <App />
      </div>
    );
  }
}

export default Demo;
