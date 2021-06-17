// Packages
import React, { useState } from 'react';
import { FormGroup, Label, Input} from 'reactstrap';

// Styles
import "./FormPassword.scss";

class FormPassword extends React.Component {

  constructor(props) {
    super(props);
  }
  componentDidMount () {
    const eye = document.querySelectorAll(".icon-eye");
    const inputEye = document.querySelectorAll(".form-password > input");
    let idx;

    for(var i=0; i < eye.length; i++){
      eye[i].addEventListener('mousedown', function(e){
        inputEye.forEach((currentValue, currentIndex) => {
          if (currentValue.id === e.target.name) {
            idx = currentIndex;
          }
        });
        inputEye[idx].type = "text";
      });  
      eye[i].addEventListener('mouseup', function(e){
        inputEye.forEach((currentValue, currentIndex) => {
          if (currentValue.id === e.target.name) {
            idx = currentIndex;
          }
        });
        inputEye[idx].type = "password";
      });
    }
  }
  render() {
    return (
      <FormGroup className="form-group-light form-password">
        <Label for="password">{this.props.label}</Label>
        <img src={window._env_.PUBLIC_URL + "/images/icons/password-hide.svg"} alt="password" name={this.props.name} className="icon-eye" />
        <Input onChange={this.props.handleFormInput} autoComplete="off" type="password" name={this.props.name} id={this.props.name} placeholder={this.props.placeholder} />
      </FormGroup>
    );
  }
};

export default FormPassword;
