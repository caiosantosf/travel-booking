import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { getUserType } from './config/security'

import Login              from './components/user/Login'
import EmailResetPassword from './components/user/EmailResetPassword'
import ResetPassword      from './components/user/ResetPassword'
import UserHome           from './components/user/UserHome'
import User               from './components/user/User'
import Users              from './components/user/Users'
import Admin              from './components/admin/AdminHome'
import Buses              from './components/bus/Buses'
import Bus                from './components/bus/Bus'
import Travels            from './components/travel/Travels'
import Travel             from './components/travel/Travel'
import Value              from './components/travel/Value'
import DeparturePlace     from './components/travel/DeparturePlace'
import Forbidden          from './components/environment/Forbidden'

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/admin" exact component={Login} />
        <Route path="/sair" exact component={Login} />
        <Route path="/email-redefine-senha" exact component={EmailResetPassword} />
        <Route path="/redefine-senha/:id" exact component={ResetPassword} />
        <Route path="/registro/" exact component={User} />
        <Route path="/usuarios/" exact render={() => (getUserType() === 'admin' ? <Users /> : <Forbidden />)}/>
        <Route path="/usuarios/:id" exact component={User} />
        <Route path="/inicial/" exact component={UserHome} />
        <Route path="/admin-inicial/" exact render={() => (getUserType() === 'admin' ? <Admin /> : <Forbidden />)}/>
        <Route path="/viagens/" exact render={() => (getUserType() === 'admin' ? <Travels /> : <Forbidden />)}/>
        <Route path="/viagens/:id" exact render={() => (getUserType() === 'admin' ? <Travel /> : <Forbidden />)}/>
        <Route path="/viagens/:travel_id/valores/:id" exact render={() => (getUserType() === 'admin' ? <Value /> : <Forbidden />)}/>
        <Route path="/viagens/:travel_id/saidas/:id" exact render={() => (getUserType() === 'admin' ? <DeparturePlace /> : <Forbidden />)}/>
        <Route path="/onibus/" exact render={() => (getUserType() === 'admin' ? <Buses /> : <Forbidden />)}/>
        <Route path="/onibus/:id" exact render={() => (getUserType() === 'admin' ? <Bus /> : <Forbidden />)}/>
      </Switch>
    </BrowserRouter>
  )
}