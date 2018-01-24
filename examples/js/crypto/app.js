/* eslint max-len: 0 */
/* eslint guard-for-in: 0 */
/* eslint no-console: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Tabs, Tab } from 'react-bootstrap';
import CCC from './ccc-streamer-utilities';
import io from 'socket.io-client';
const socket = io.connect('https://streamer.cryptocompare.com/');

export default class App extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        key: 1,
        currentPrice: {},
        cryptos: [],
        direction: 'down',
        subscription: [ '5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~XRP~USD', '5~CCCAGG~LTC~USD' ]
      };
      // this.dataUnpack = this.dataUnpack.bind(this);
    }

    dataUnpack = (data) => {
      const currentPrice = this.state.currentPrice;
      const from = data.FROMSYMBOL;
      const to = data.TOSYMBOL;
      // const fsym = CCC.STATIC.CURRENCY.getSymbol(from);
      const tsym = CCC.STATIC.CURRENCY.getSymbol(to);
      const pair = from + to;

      // Do NOT use dot notionation for currentPrice[pair]
      if (!currentPrice.hasOwnProperty(pair)) {
        currentPrice[pair] = {};
      }

      for (const key in data) {
        currentPrice[pair][key] = data[key];
      }

      if (currentPrice[pair].LASTTRADEID) {
        currentPrice[pair].LASTTRADEID =
        parseInt(currentPrice[pair].LASTTRADEID, 10).toFixed(0);
      }

      currentPrice[pair].CHANGE24HOUR = CCC.convertValueToDisplay(
          tsym, (currentPrice[pair].PRICE - currentPrice[pair].OPEN24HOUR)
        );

      currentPrice[pair].CHANGE24HOURPCT = (
        (currentPrice[pair].PRICE - currentPrice[pair].OPEN24HOUR) /
        currentPrice[pair].OPEN24HOUR * 100).toFixed(2) + '%';

      // console.log(currentPrice[pair], from, tsym, fsym);
      // Check cryptos array for like objects and replace each crypto with updated version
      const indexOfCrypto = this.state.cryptos.indexOf(currentPrice[pair]);
      if (indexOfCrypto === -1) {
        this.state.cryptos.push(currentPrice[pair]);
      } else {
        this.state.cryptos[indexOfCrypto] = currentPrice[pair];
      }
      console.log(this.state.cryptos);
      this.setState({ cryptos: this.state.cryptos });
    }

    componentDidMount = () => {
    }

    handleStartStream = () => {
      // Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
      // Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
      // For aggregate quote updates use CCCAGG as market
      socket.emit('SubAdd', { subs: this.state.subscription });
      const that = this;
      socket.on('m', (message) => {
        const messageType = message.substring(0, message.indexOf('~'));
        let res = {};
        if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
          res = CCC.CURRENT.unpack(message);
          that.dataUnpack(res);
        }
      });
    }

    handleStopStream = () => {
      socket.emit('SubRemove', { subs: this.state.subscription } );
    }

    handleTabChange = (key) => {
      this.setState({
        key
      });
    }

    handlePriceDirection = (priceChange) => {
      // Check to see if price has a '-'
      if (/[-]/.test(priceChange)) {
        return 'down';
      } else {
        return 'up';
      }
    }

    render() {
      const tableOptions = {
        prePage: <i className='glyphicon glyphicon-chevron-left' />,
        nextPage: <i className='glyphicon glyphicon-chevron-right' />,
        firstPage: <i className='glyphicon glyphicon-step-backward' />,
        lastPage: <i className='glyphicon glyphicon-step-forward' />
      };

      return (
        <Tabs id='tabs' activeKey={ this.state.key } onSelect={ this.handleTabChange } animation>
          <Tab eventKey={ 1 } title='All'>
            <button type='button' onClick={ this.handleStartStream } className='btn btn-success'>Start Stream</button>
            <button type='button' onClick={ this.handleStopStream } className='btn btn-danger'>Stop Stream</button>
            <BootstrapTable ref='allTable' data={ this.state.cryptos } options={ tableOptions } pagination search>
              <TableHeaderColumn dataField='FROMSYMBOL' isKey dataSort>Symbol</TableHeaderColumn>
              <TableHeaderColumn dataField='PRICE' width='300' dataSort>Price</TableHeaderColumn>
              <TableHeaderColumn dataField='CHANGE24HOUR' columnClassName={ this.handlePriceDirection } dataSort>Change (24h$)</TableHeaderColumn>
              <TableHeaderColumn dataField='CHANGE24HOURPCT' columnClassName={ this.handlePriceDirection } dataSort>Change (24h%)</TableHeaderColumn>
            </BootstrapTable>
          </Tab>
          <Tab eventKey={ 2 } title='Coins'>Table of Coins</Tab>
          <Tab eventKey={ 3 } title='Tokens'>Table of Tokens</Tab>
          <Tab eventKey={ 4 } title='Portfolio'>Portfolio Table</Tab>
        </Tabs>
      );
    }
}
