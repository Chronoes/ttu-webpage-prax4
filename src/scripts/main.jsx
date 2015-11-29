import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {render} from 'react-dom';

import App from './App';
import reducers from './reducers';

const createStoreMiddleware = applyMiddleware(thunk)(createStore);

window.onload = () => render(<Provider store={createStoreMiddleware(reducers)}><App /></Provider>, document.getElementById('content'));
