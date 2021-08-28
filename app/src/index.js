import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Routes from './Routes'
import '@popperjs/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.esm.min.js'
import Teste from './components/Teste'

ReactDOM.render(
  <React.StrictMode>
    <Teste />
  </React.StrictMode>,
  document.getElementById('root')
)