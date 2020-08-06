import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/home';
import Shop from './pages/shop/index';
import DashboardSettings from './pages/dashboard/settings/index';
import DashboardSettingsProfile from './pages/dashboard/settings/profile';
import DashboardSettingsCommunicationPrefernces from './pages/dashboard/settings/communications-preferences';
import DashboardSettingsPrivacySecurity from './pages/dashboard/settings/privacy-security';
import Advisor from './pages/advisor/index';
import AdvisorClient from './pages/advisor/client';
import AnyTVPartner from './pages/any-tv-partner';
import AnyMarketing from './pages/any-marketing';
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router basename={`${process.env.PUBLIC_URL}`}>
    <Switch>
      <Route path="/shop">
        <Shop />
      </Route>
      <Route path="/dashboard/settings/privacy-security">
        <DashboardSettingsPrivacySecurity />
      </Route>
      <Route path="/dashboard/settings/communication-preferences">
        <DashboardSettingsCommunicationPrefernces />
      </Route>
      <Route path="/dashboard/settings/profile">
        <DashboardSettingsProfile />
      </Route>
      <Route path="/dashboard/settings">
        <DashboardSettings />
      </Route>
      <Route path="/advisor/client">
        <AdvisorClient />
      </Route>
      <Route path="/advisor">
        <Advisor />
      </Route>
      <Route path="/any-tv-partner">
        <AnyTVPartner />
      </Route>
      <Route path="/any-marketing">
        <AnyMarketing />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
