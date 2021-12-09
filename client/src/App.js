/* eslint-disable */
import React, { Fragment } from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom';
import Store from './store';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Routes from './components/routes';

function App() {

  return (
    <Provider store={Store}>
      <Router>
        <Fragment>          
            <Navbar/>
            <Switch>
              {/* <Route exact path="/" component={Landing} /> */}
              <Route component={Routes} />
            </Switch>
            <Footer />
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
