import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

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

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/"                     exact component={Login} />
        <Route path="/admin"                exact component={Login} />
        <Route path="/email-redefine-senha" exact component={EmailResetPassword} />
        <Route path="/redefine-senha/:id"         component={ResetPassword} />
        <Route path="/viagens/"             exact component={Travels} />
        <Route path="/viagens/:id"                component={Travel} />
        <Route path="/inicial/"             exact component={UserHome} />
        <Route path="/admin-inicial/"       exact component={Admin} />
        <Route path="/registro/"            exact component={User} />
        <Route path="/onibus/"              exact component={Buses} />
        <Route path="/onibus/:id"                 component={Bus} />
        <Route path="/usuarios/"            exact component={Users} />
        <Route path="/usuarios/:id"               component={User} />
      </Switch>
    </BrowserRouter>
  )
}