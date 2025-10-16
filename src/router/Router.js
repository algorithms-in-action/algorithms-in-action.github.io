import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from '../App';
import About from '../components/About';
import Mainmenu from '../components/MainMenu';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/mainmenu" component={Mainmenu} />
        <Route path="/animation" component={App} />
        <Route exact path="*" component={Mainmenu} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
