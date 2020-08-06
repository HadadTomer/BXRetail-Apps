import React from 'react'
import { Container } from 'reactstrap';

// Components
import NavbarMain from '../components/NavbarMain';
import WelcomeBar from '../components/WelcomeBar';
import FooterMain from '../components/FooterMain';
import AccountsSubnav from '../components/AccountsSubnav';
import AccountsDropdown from '../components/AccountsDropdown';
import AccountsBalance from '../components/AccountsBalance';

// Data
import data from '../data/accounts-dashboard.json';

// Styles
import "../styles/pages/accounts.scss";

class AccountsDashboard extends React.Component {
  render() {
    return(
      <div className="dashboard accounts accounts-dashboard">
        <NavbarMain />
        <WelcomeBar />
        <Container>
          <div className="inner">
            <div className="sidebar">
              {
                Object.keys(data.subnav).map(key => {
                  return (
                    <AccountsSubnav key={data.subnav[key].title} subnav={data.subnav[key]} />
                  );
                })      
              }
            </div>
            <div className="content">
              <div className="accounts-hdr">
                <h1>{data.title}</h1>
                <AccountsDropdown text={data.dropdown} />
              </div>
              {
                Object.keys(data.balances).map(key => {
                  return (
                    <AccountsBalance key={data.balances[key].title} balance={data.balances[key]} />
                  );
                })      
              }
            </div>
          </div>
        </Container>
        <FooterMain />
      </div>
    )
  }
}
export default AccountsDashboard