import React from "react";
import { Dashboard, Transactions, Block } from "./view";
import { MemoryRouter, Switch, Route } from "react-router-dom";

import "./App.less";

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Switch>
        <Route path="/block/:height">
          <Block></Block>
        </Route>
        <Route path="/txn/:hash">
          <Transactions></Transactions>
        </Route>
        <Route path="/">
          <Dashboard></Dashboard>
        </Route>
      </Switch>
    </MemoryRouter>
  );
};

export default App;
