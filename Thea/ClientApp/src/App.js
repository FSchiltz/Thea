import React, { Component } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';

import './custom.css';

export default class App extends Component {
  render () {
    return (
      <Layout>
        <Home />
      </Layout> 
    );
  }
}
