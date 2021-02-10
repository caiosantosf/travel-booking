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
import Reservation        from './components/reservation/Reservation'
import Forbidden          from './components/environment/Forbidden'
import ToRegister         from './components/environment/ToRegister'

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/admin" exact component={Login} />
        <Route path="/sair" exact component={Login} />
        <Route path="/email-redefine-senha" exact component={EmailResetPassword} />
        <Route path="/redefine-senha/:id" exact component={ResetPassword} />
        <Route path="/registro/" exact component={User} />
        <Route path="/usuarios/" exact render={props => (getUserType() === 'admin' ? <Users { ...props } userType={getUserType()}/> : <Forbidden />)}/>
        <Route path="/usuarios/:id" exact component={User} />
        <Route path="/" exact render={props => <UserHome { ...props } userType={getUserType()} />} />
        <Route path="/admin-inicial/" exact render={props => (getUserType() === 'admin' ? <Admin { ...props }/> : <Forbidden />)}/>
        <Route path="/viagens/" exact render={props => (getUserType() === 'admin' ? <Travels { ...props }/> : <Forbidden />)}/>
        <Route path="/viagens/:id" exact render={props => (getUserType() === 'admin' ? <Travel { ...props }/> : <Forbidden />)}/>
        <Route path="/viagens/:travel_id/valores/:id" exact render={props => (getUserType() === 'admin' ? <Value { ...props }/> : <Forbidden />)}/>
        <Route path="/viagens/:travel_id/saidas/:id" exact render={props => (getUserType() === 'admin' ? <DeparturePlace { ...props }/> : <Forbidden />)}/>
        <Route path="/onibus/" exact render={props => (getUserType() === 'admin' ? <Buses { ...props }/> : <Forbidden />)}/>
        <Route path="/onibus/:id" exact render={props => (getUserType() === 'admin' ? <Bus { ...props }/> : <Forbidden />)}/>
        <Route path="/reserva/:travel_id" exact render={props => (getUserType() ? <Reservation { ...props }/> : <ToRegister { ...props }/>)}/>
      </Switch>
    </BrowserRouter>
  )
}