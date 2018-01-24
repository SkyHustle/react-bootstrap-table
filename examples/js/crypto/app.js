/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Tabs, Tab } from 'react-bootstrap';

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
        key: 1
      };
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
