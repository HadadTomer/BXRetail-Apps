// Packages
import React, { useState } from 'react';

// Styles
import "./AccountsDropdown.scss";

const AccountsDropdown = (props) => {
  
  return (
    <div className="accounts-dropdown">
      <a href="#">{props.text}</a>
    </div>
  );
};

export default AccountsDropdown;
