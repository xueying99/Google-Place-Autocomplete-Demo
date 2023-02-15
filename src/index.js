import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers/reducers';
import locationApp from './store/locations/locations';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  locationApp,
  // reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
serviceWorker.unregister();