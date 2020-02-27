import React from 'react';
import { Route, Redirect, Switch } from "react-router-dom";
import './App.css';
import './css/custom.css'
import IndexPage from './components/index'
import Navbar from './components/navbar';


function App() {
  return (
    <div className="main-container">
      <Navbar/>
       <main className=" home-content">
          
          <Switch>
            <Route path="/index" component={IndexPage}/>
            <Redirect from="/" exact to="/index" component={IndexPage} />
            
          </Switch>
        </main>
    </div>
  );
}

export default App;
