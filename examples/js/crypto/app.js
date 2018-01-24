/* eslint max-len: 0 */
/* eslint guard-for-in: 0 */
/* eslint no-console: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Tabs, Tab } from 'react-bootstrap';
import CCC from './ccc-streamer-utilities';
import io from 'socket.io-client';
const socket = io.connect('https://streamer.cryptocompare.com/');

const products = [];

function addProducts(quantity) {
  const startId = products.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i;
    products.push({
      id: id,
      name: 'Item name ' + id,
      price: 2100 + i
    });
  }
}

addProducts(15);

export default class App extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        key: 1,
        currentPrice: {}
      };
      // this.dataUnpack = this.dataUnpack.bind(this);
    }

    dataUnpack = (data) => {
      const currentPrice = this.state.currentPrice;
      const from = data.FROMSYMBOL;
      const to = data.TOSYMBOL;
      const fsym = CCC.STATIC.CURRENCY.getSymbol(from);
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

      console.log(currentPrice[pair], from, tsym, fsym);
    }

    componentDidMount = () => {
    }

    handleStartStream = () => {
      // Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
      // Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
      // For aggregate quote updates use CCCAGG as market
      const subscription = [ '5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD' ];
      socket.emit('SubAdd', { subs: subscription });
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
      socket.emit('SubRemove', { subs: [ '5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD' ] } );
    }

    handleTabChange = (key) => {
      this.setState({
        key
      });
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
            <BootstrapTable ref='allTable' data={ products } options={ tableOptions } pagination search>
              <TableHeaderColumn dataField='id' isKey dataSort>Product ID</TableHeaderColumn>
              <TableHeaderColumn dataField='name' width='300' dataSort>Product Name</TableHeaderColumn>
              <TableHeaderColumn dataField='price' dataSort>Product Price</TableHeaderColumn>
            </BootstrapTable>
          </Tab>
          <Tab eventKey={ 2 } title='Coins'>Table of Coins</Tab>
          <Tab eventKey={ 3 } title='Tokens'>Table of Tokens</Tab>
          <Tab eventKey={ 4 } title='Portfolio'>Portfolio Table</Tab>
        </Tabs>
      );
    }
}
