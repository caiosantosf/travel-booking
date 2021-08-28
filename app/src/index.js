import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Routes from './Routes'
import '@popperjs/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.esm.min.js'

caches.keys().then((names) => {
  names.forEach((name) => {
    caches.delete(name);
  });
});

console.log('oi')

ReactDOM.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
  document.getElementById('root')
)