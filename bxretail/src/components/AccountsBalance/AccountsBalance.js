// Packages
import React, { useState } from 'react';
import { Collapse, Button  } from 'reactstrap';

// Styles
import "./AccountsBalance.scss";

const AccountsBalance = (props) => {
  
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="accounts-balance">
      <div className="accounts-balance-header">
        <a href="#" onClick={toggle}>{props.balance.title}</a>
      <Button color="primary">See All Activity</Button>
      </div>
      <Collapse isOpen={isOpen}>
        <table>
          <thead>
            <tr>
              <th>Accounts</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(props.balance.accounts).map(key => {
                return (
                  <tr>
                    <td><a href={props.balance.accounts[key].href}>{props.balance.accounts[key].account}</a></td>
                    <td>{props.balance.accounts[key].balance}</td>
                  </tr>
                );
              })      
            }
          </tbody>
        </table>
      </Collapse>
    </div>
  );
};

export default AccountsBalance;
