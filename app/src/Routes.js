import React, { Suspense } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { getUserType } from './config/security'

const Login              = React.lazy(() => import('./components/user/Login'))
const UserHome           = React.lazy(() => import('./components/user/UserHome'))
const Admin              = React.lazy(() => import('./components/admin/AdminHome'))
const EmailResetPassword= React.lazy(() => import('./components/user/EmailResetPassword'))
const ResetPassword     = React.lazy(() => import('./components/user/ResetPassword'))
const User              = React.lazy(() => import('./components/user/User'))
const Users             = React.lazy(() => import('./components/user/Users'))
const Buses             = React.lazy(() => import('./components/bus/Buses'))
const Bus               = React.lazy(() => import('./components/bus/Bus'))
const Travels           = React.lazy(() => import('./components/travel/Travels'))
const Travel            = React.lazy(() => import('./components/travel/Travel'))
const Value             = React.lazy(() => import('./components/travel/Value'))
const DeparturePlace    = React.lazy(() => import('./components/travel/DeparturePlace'))
const Passengers        = React.lazy(() => import('./components/travel/Passengers'))
const Passenger         = React.lazy(() => import('./components/travel/Passenger'))
const Payments          = React.lazy(() => import('./components/travel/Payments'))
const Payment           = React.lazy(() => import('./components/travel/Payment'))
const InactiveReservations= React.lazy(() => import('./components/travel/InactiveReservations'))
const Reservation       = React.lazy(() => import('./components/reservation/Reservation'))
const ReturnPayment     = React.lazy(() => import('./components/reservation/ReturnPayment'))
const UserReservations  = React.lazy(() => import('./components/reservation/UserReservations'))
const Forbidden         = React.lazy(() => import('./components/environment/Forbidden'))
const ToRegister        = React.lazy(() => import('./components/environment/ToRegister'))

export default function Routes() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Switch>
          <Route path="/acesso-negado"                     exact component={Forbidden} />
          <Route path="/login"                             exact component={Login} />
          <Route path="/admin"                             exact component={Login} />
          <Route path="/sair"                              exact component={Login} />
          <Route path="/email-redefine-senha"              exact component={EmailResetPassword} />
          <Route path="/redefine-senha/:id"                exact component={ResetPassword} />
          <Route path="/registro/"                         exact component={User} />
          <Route path="/usuarios/"                         exact render={props => (getUserType() === 'admin' ? <Users { ...props } /> : <Forbidden />)}/>
          <Route path="/usuarios/:id"                      exact component={User} />
          <Route path="/"                                  exact render={props => (getUserType() === 'admin' ? <Admin/> : <UserHome/> )} />
          <Route path="/admin-inicial/"                    exact render={props => (getUserType() === 'admin' ? <Admin   { ...props }/> : <Forbidden />)}/>
          <Route path="/viagens/"                          exact render={props => (getUserType() === 'admin' ? <Travels { ...props }/> : <Forbidden />)}/>
          <Route path="/viagens/:id"                       exact render={props => (getUserType() === 'admin' ? <Travel  { ...props }/> : <Forbidden />)}/>
          <Route path="/viagens/:travel_id/reservas"       exact render={props => (getUserType() === 'admin' ? <Passengers  { ...props }/> : <Forbidden />)}/>
          <Route path="/viagens/:travel_id/reservas/:id"   exact render={props => (getUserType() === 'admin' ? <Passenger  { ...props }/> : <Forbidden />)}/>
          <Route path="/viagens/:travel_id/pagamentos"     exact render={props => (getUserType() === 'admin' ? <Payments  { ...props }/> : <Forbidden />)}/>
          <Route path="/viagens/:travel_id/pagamentos/:id" exact render={props => (getUserType() === 'admin' ? <Payment { ...props }/> : <Forbidden />)}/>
          <Route path="/viagens/:travel_id/reservas-inativas" exact render={props => (getUserType() === 'admin' ? <InactiveReservations  { ...props }/> : <Forbidden />)}/>
          <Route path="/viagens/:travel_id/valores/:id"    exact render={props => (getUserType() === 'admin' ? <Value   { ...props }/> : <Forbidden />)}/>
          <Route path="/viagens/:travel_id/saidas/:id"     exact render={props => (getUserType() === 'admin' ? <DeparturePlace { ...props }/> : <Forbidden />)}/>
          <Route path="/onibus/"                           exact render={props => (getUserType() === 'admin' ? <Buses { ...props }/> : <Forbidden />)}/>
          <Route path="/onibus/:id"                        exact render={props => (getUserType() === 'admin' ? <Bus   { ...props }/> : <Forbidden />)}/>
          <Route path="/reservas"                          exact render={props => (getUserType() === 'admin' ? <UserHome { ...props }/> : <Forbidden />)} />
          <Route path="/pagamento/:id/:status"             exact render={props => (getUserType() === 'regular' ? <ReturnPayment { ...props }/> : <Forbidden />)} />
          <Route path="/minhas-reservas"                   exact render={props => (getUserType() === 'regular' ? <UserReservations { ...props }/> : <Forbidden />)} />
          <Route path="/reserva/:travel_id/:random"        exact render={props => (getUserType() ? <Reservation { ...props }/> : <ToRegister { ...props }/>)}/>
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}