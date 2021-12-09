import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './home';
import Mysterybox from './mysterybox';

const Routes = () => {
  return (
    <section className="container">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/mysterybox" component={Mysterybox} />
      </Switch>
    </section>
  );
};

export default Routes;
