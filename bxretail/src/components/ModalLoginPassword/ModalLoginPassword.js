/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

// Packages
import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  CustomInput,
  TabContent, TabPane
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

// Components
import FormPassword from '../../components/FormPassword';

// Styles
import "./ModalLoginPassword.scss";

// Data
import data from './data.json';

class ModalLoginPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      activeTab: '1',
      loginMethodUnset: true,
      loginMethodFormGroupClass: ''
    };
  }
  onClosed() {
    this.setState({
      activeTab: '1',
      loginMethodUnset: true,
      loginMethodFormGroupClass: ''
    });
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  toggleTab(tab) {
    this.setState({
      activeTab: tab
    });
  }
  setLoginMethod() {
    this.setState({
      loginMethodUnset: false,
      loginMethodFormGroupClass: 'form-group-light'
    });
  }
  render() {
    const closeBtn = <div />;
    return (
      <div>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} onClosed={this.onClosed.bind(this)} className="modal-login">
          <ModalHeader toggle={this.toggle.bind(this)} close={closeBtn}><img src={process.env.PUBLIC_URL + "/images/logo.svg"} alt="logo" /></ModalHeader>
          <ModalBody>
            <form>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <h4>{data.titles.welcome}</h4>
                  <FormGroup className="form-group-light">
                    <Label for="username">{data.form.fields.username.label}</Label>
                    <Input type="text" name="username" id="username" placeholder={data.form.fields.username.placeholder} />
                  </FormGroup>
                  <FormPassword name="password" label={data.form.fields.password.label} placeholder={data.form.fields.password.placeholder} />
                  <FormGroup className="form-group-light">
                    <CustomInput type="checkbox" id="remember" label={data.form.fields.remember.label} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('2'); }}>{data.form.buttons.next}</Button>
                  </div>
                  <div>
                    <Button type="button" color="link" size="sm" className="text-info pl-0" onClick={() => { this.toggleTab('4'); }}>{data.form.buttons.reset}</Button>
                  </div>
                  <div>
                    <Button type="button" color="link" size="sm" className="text-info pl-0" onClick={() => { this.toggleTab('5'); }}>{data.form.buttons.reset_password}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="2">
                  <h4>{data.titles.login_method}</h4>
                  <FormGroup className={this.state.loginMethodFormGroupClass}>
                    <div>
                      <CustomInput type="radio" id="login_method_email" name="login_method" label={data.form.fields.login_method.options.email} className="form-check-inline" onClick={this.setLoginMethod.bind(this)} />
                      <CustomInput type="radio" id="login_method_text" name="login_method" label={data.form.fields.login_method.options.text} className="form-check-inline" onClick={this.setLoginMethod.bind(this)} />
                      <CustomInput type="radio" id="login_method_faceid" name="login_method" label={data.form.fields.login_method.options.faceid} className="form-check-inline" onClick={this.setLoginMethod.bind(this)} />
                    </div>
                  </FormGroup>
                  <div className="mb-4 text-center">
                    <Button type="button" color="primary" disabled={this.state.loginMethodUnset} onClick={() => { this.toggleTab('3'); }}>{data.form.buttons.login}</Button>
                  </div>
                  <div className="text-center">
                    <Button type="button" color="link" size="sm" className="text-info" onClick={this.toggle.bind(this)}>{data.form.buttons.help}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="3">
                  <div className="mobile-loading" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/login-device-outline.jpg)`}}>
                    <div className="spinner">
                      <FontAwesomeIcon icon={faCircleNotch} size="3x" className="fa-spin" />
                    </div>
                    <p>{data.mobile.loading}</p>
                  </div>
                  <div className="mt-4 text-center">
                    <Button type="button" color="link" size="sm" className="text-info" onClick={this.toggle.bind(this)}>{data.form.buttons.help}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="4">
                  <h4>{data.form.buttons.recover_username}</h4>
                  <FormGroup className="form-group-light">
                    <Label for="email">{data.form.fields.email.label}</Label>
                    <Input type="text" name="email" id="email" placeholder={data.form.fields.email.placeholder} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('6'); }}>{data.form.buttons.recover_username}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="5">
                  <h4>{data.form.buttons.recover_password}</h4>
                  <FormGroup className="form-group-light">
                    <Label for="email">{data.form.fields.email.label}</Label>
                    <Input type="text" name="email" id="email" placeholder={data.form.fields.email.placeholder} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('6'); }}>{data.form.buttons.recover_password}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="6">
                  <h4>{data.titles.recover_username_success}</h4>
                  <div className="mb-3 text-center">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('1'); }}>{data.form.buttons.login}</Button>
                  </div>
                </TabPane>
              </TabContent>
            </form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ModalLoginPassword;
