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
import Value              from './components/travel/Value'
import DeparturePlace     from './components/travel/DeparturePlace'

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/"                           exact component={Login} />
        <Route path="/admin"                      exact component={Login} />
        <Route path="/email-redefine-senha"       exact component={EmailResetPassword} />
        <Route path="/redefine-senha/:id"         exact component={ResetPassword} />
        <Route path="/registro/"                  exact component={User} />
        <Route path="/usuarios/"                  exact component={Users} />
        <Route path="/usuarios/:id"               exact component={User} />
        <Route path="/inicial/"                   exact component={UserHome} />
        <Route path="/admin-inicial/"             exact component={Admin} />

        <Route path="/viagens/"                   exact component={Travels} />
        <Route path="/viagens/:id"                exact component={Travel} />
        <Route path="/viagens/:travel_id/valores/:id" exact component={Value} />
        <Route path="/viagens/:travel_id/saidas/:id"  exact component={DeparturePlace} />
                
        <Route path="/onibus/"                    exact component={Buses} />
        <Route path="/onibus/:id"                 exact component={Bus} />
      </Switch>
    </BrowserRouter>
  )
}