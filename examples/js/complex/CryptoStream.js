require('./CryptoStream.css');
import React from 'react';

class CryptoStream extends React.Component {
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-5 col-md-offset-1 price-boxes'>
            <div className='panel-group'>
              <div className='panel panel-default'>
                <div className='panel-body'>
                  <h6><a href='https://www.cryptocompare.com'>Source: CryptoCompare.com</a></h6>
                  <h2 className='price-display'>BTC - USD
                    <span className='price' id='PRICE_BTC'></span>
                  </h2>

                  <h5>24h Change:
                    <span id='CHANGE24HOUR_BTC'></span><span id='CHANGE24HOURPCT_BTC'></span><br/>
                  </h5>
                  <h5>Last Market: <span className='exchange' id='LASTMARKET_BTC'></span> <br/></h5>
                  <h5>Trade ID: <span id='LASTTRADEID_BTC'></span><br/></h5>
                  <h5>Open Hour: <span id='OPENHOUR_BTC'></span><br/></h5>
                  <h5>High Hour: <span id='HIGHHOUR_BTC'></span><br/></h5>
                  <h5>Low Hour: <span id='LOWHOUR_BTC'></span><br/></h5>
                  <h5>Open Day: <span id='OPEN24HOUR_BTC'></span><br/></h5>
                  <h5>High Day: <span id='HIGH24HOUR_BTC'></span><br/></h5>
                  <h5>Low Day: <span id='LOW24HOUR_BTC'></span><br/></h5>
                  <h5>Last Trade Volume: <span id='LASTVOLUME_BTC'></span><br/></h5>
                  <h5>Last Trade Volume To: <span id='LASTVOLUMETO_BTC'></span><br/></h5>
                  <h5>24h Volume: <span id='VOLUME24HOUR_BTC'></span><br/></h5>
                  <h5>24h VolumeTo: <span id='VOLUME24HOURTO_BTC'></span><br/></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoStream;
