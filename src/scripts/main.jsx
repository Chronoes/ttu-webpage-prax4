import React from 'react';
import {render} from 'react-dom';
import App from './App';

window.onload = () => render(<App />, document.getElementById('content'));
