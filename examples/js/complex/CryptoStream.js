/* eslint no-console: 0 */
/* eslint no-debugger: 0 */
require('./CryptoStream.css');
import React from 'react';
import io from 'socket.io-client';
import CCC from './ccc-streamer-utilities';
import $ from 'jquery';

const currentPrice = {};

function displayData(current, from, tsym, fsym) {
  const priceDirection = current.FLAGS;
  for (const key in current) {
    if (key === 'CHANGE24HOURPCT') {
      $('#' + key + '_' + from).text(' (' + current[key] + ')');
    } else if (key === 'LASTVOLUMETO' || key === 'VOLUME24HOURTO') {
      $('#' + key + '_' + from).text(CCC.convertValueToDisplay(tsym, current[key]));
    } else if (key === 'LASTVOLUME' ||
             key === 'VOLUME24HOUR' ||
             key === 'OPEN24HOUR' ||
             key === 'OPENHOUR' ||
             key === 'HIGH24HOUR' ||
             key === 'HIGHHOUR' ||
             key === 'LOWHOUR' ||
             key === 'LOW24HOUR') {
      $('#' + key + '_' + from).text(CCC.convertValueToDisplay(fsym, current[key]));
    } else {
      $('#' + key + '_' + from).text(current[key]);
    }
  }

  $('#PRICE_' + from).removeClass();

  if (priceDirection & 1) {
    $('#PRICE_' + from).addClass('up');
  } else if (priceDirection & 2) {
    $('#PRICE_' + from).addClass('down');
  }

  if (current.PRICE > current.OPEN24HOUR) {
    $('#CHANGE24HOURPCT_' + from).removeClass();
    $('#CHANGE24HOURPCT_' + from).addClass('up');
  } else if (current.PRICE < current.OPEN24HOUR) {
    $('#CHANGE24HOURPCT_' + from).removeClass();
    $('#CHANGE24HOURPCT_' + from).addClass('down');
  }
}

function dataUnpack(data) {
  const from = data.FROMSYMBOL;
  const to = data.TOSYMBOL;
  const fsym = CCC.STATIC.CURRENCY.getSymbol(from);
  const tsym = CCC.STATIC.CURRENCY.getSymbol(to);
  const pair = from + to;
  console.log(data);

  if (!currentPrice.hasOwnProperty(pair)) {
    currentPrice.pair = {};
  }

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      currentPrice.pair[key] = data[key];
    }
  }

  if (currentPrice.pair.LASTTRADEID) {
    currentPrice.pair.LASTTRADEID = parseInt(currentPrice.pair.LASTTRADEID, 10).toFixed(0);
  }
  currentPrice.pair.CHANGE24HOUR = CCC.convertValueToDisplay(
      tsym, (currentPrice.pair.PRICE - currentPrice.pair.OPEN24HOUR)
    );
  currentPrice.pair.CHANGE24HOURPCT = (
    (currentPrice.pair.PRICE - currentPrice.pair.OPEN24HOUR) /
     currentPrice.pair.OPEN24HOUR * 100).toFixed(2) + '%';
  displayData(currentPrice.pair, from, tsym, fsym);
}

function fetchData() {
  const socket = io.connect('https://streamer.cryptocompare.com/');
  // Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
  // Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
  // For aggregate quote updates use CCCAGG as market
  const subscription = [ '5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD' ];
  socket.emit('SubAdd', { subs: subscription });
  socket.on('m', function(message) {
    const messageType = message.substring(0, message.indexOf('~'));
    let res = {};
    if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
      res = CCC.CURRENT.unpack(message);
      dataUnpack(res);
    }
  });
}

fetchData();

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
