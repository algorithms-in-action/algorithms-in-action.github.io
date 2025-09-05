import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from '../App';
import About from '../components/About';
import Mainmenu from '../components/MainMenu';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/about" component={About} />
        <Route path="/mainmenu" component={Mainmenu} />
        <Route component={App} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
