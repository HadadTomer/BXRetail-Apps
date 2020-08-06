// Packages
import React, { useState } from 'react';
import { FormGroup, Label, Input} from 'reactstrap';

// Styles
import "./FormPassword.scss";

class FormPassword extends React.Component {
  componentDidMount () {
    var eye = document.querySelectorAll(".icon-eye");
    var inputEye = document.querySelectorAll(".form-password > input");

    for(var i=0; i < eye.length; i++){
      eye[i].addEventListener('mousedown', function(){
        inputEye[i - 1].type = "text";
      });  
      eye[i].addEventListener('mouseup', function(){
        inputEye[i - 1].type = "password";
      });
    }
  }
  render() {
    return (
      <FormGroup className="form-group-light form-password">
        <Label for="password">{this.props.label}</Label>
        <img src={process.env.PUBLIC_URL + "/images/icons/password-hide.svg"} alt="password" className="icon-eye" />
        <Input type="password" name={this.props.name} id={this.props.name} placeholder={this.props.placeholder} />
      </FormGroup>
    );
  }
};

export default FormPassword;
