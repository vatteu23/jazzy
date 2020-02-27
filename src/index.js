import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter } from "react-router-dom";
import './index.css';
import App from './App';
import 'jquery/dist/jquery';
import 'popper.js/dist/umd/popper';
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import * as serviceWorker from './serviceWorker';

ReactDOM.render( <HashRouter >
    <App />
</HashRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
