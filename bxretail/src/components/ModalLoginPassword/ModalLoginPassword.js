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
import FlowHandler from '../Controller/FlowHandler'; /* PING INTEGRATION: */
import Session from '../Utils/Session'; /* PING INTEGRATION: */

// Styles
import "./ModalLoginPassword.scss";

// Data
import data from './data.json';
import PingOneUsers from '../Integration/PingOneUsers';

class ModalLoginPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      activeTab: '1',
      loginMethodUnset: true,
      loginMethodFormGroupClass: '',
      regCode: 0,
      username: "",
      password: "",
      rememberme: false,
      errorTitle: "Oh snap!",
      errorMsg: "There was a problem. Sorry.",
      haveError: false,
      OTP: ""
    };
    this.flowHandler = new FlowHandler(); /* PING INTEGRATION: */
    this.session = new Session(); /* PING INTEGRATION: */
  }
  onClosed() {
    this.setState({
      activeTab: '1',
      loginMethodUnset: true,
      loginMethodFormGroupClass: ''
    });
  }
  toggle(tab) {
    this.setState({
      isOpen: !this.state.isOpen
    });
    /* PING INTEGRATION: */ //TODO this needs to go away I think. Usage deprecated by moving tab 7 back to reg where it belongs. Verify that before removing.
    // toggle() is only about show/hide modal UIs. Added tab arg
    // and call to toggleTab() because 
    // some uses cases require us to show a different default tabPane.
    if (tab) {
      this.toggleTab(tab);
    }
  }
  toggleTab(tab) {
    this.setState({haveError: false});
    // Tab 3 is the progress spinner.
    if (tab === "3") {
      this.handleUserAction(this.session.getAuthenticatedUserItem("authMode", "session"));
    } else {
      this.setState({
        activeTab: tab
      });
    }
    // HACK for getting focus on subsequent tab fields.... because reactstrap. :-(
    if (tab === "5") { document.getElementById("email").focus(); } // FIXME This is not working and I can't figure out why.
    
  }
  setLoginMethod() {
    this.setState({
      loginMethodUnset: false,
      loginMethodFormGroupClass: 'form-group-light'
    });
  }

  /* BEGIN PING INTEGRATION: */
  handleFormInput(e) {
    //Update state based on the input's Id and value.
    let formData = {};
    //If rememberme checkbox, just flip its value.
    if (e.target.id === "rememberme") {
      if (e.target.checked) {
        this.session.setAuthenticatedUserItem("rememberMe", this.state.username, "local")
      } else {
        this.session.removeAuthenticatedUserItem("rememberMe", "local");
      }
      this.setState({
        rememberme: e.target.checked
      });
    } else if (e.target.id === "OTP") {
      this.setState({
        OTP: e.target.value
      })
    } else {
      formData[e.target.id] = e.target.value;
      this.setState(formData);
      console.log("formData", formData);
    }
  }
  handleUserAction(authMode) {
    switch (authMode) {
      case "registration": //TODO we should be able to remove this registration case. It should now be in ModalRegister. Remove and regression test before committing.
        console.log("made it to reg");
        this.flowHandler.verifyRegEmailCode({ regEmailCode: this.state.regCode, flowId: this.props.flowId })
          .then(response => {
            console.log("UI response", response);
            if (response.status === "COMPLETED") {
              window.location.replace(response.resumeUrl); //Using replace() because we don't want the user to go "back" to the middle of the reg process.
            } else {
              console.log("UNEXPECTED STATUS", response);
            }
          });
        break;
      case "login":
        this.flowHandler.loginUser({ loginData: this.state, flowId: this.props.flowId })
          .then(response => {
            if (response.status === "COMPLETED") {
                window.location.replace(response.resumeUrl); //Using replace() because we don't want the user to go "back" to the middle of the login process.
            } else if (response.status === "OTP_REQUIRED") {
                console.log("OTP Required");
                this.toggleTab("2");
            } else if (response.code) { //Error case.
                console.log("UNEXPECTED STATUS", JSON.stringify(response));
                let errorCode, errorDetails;
                  if (response.details[0].code === "INVALID_CREDENTIALS") { errorCode = response.details[0].code.replace("_", " "); errorDetails = response.details[0].message;}
                  if (response.details[0].code === "INVALID_VALUE") { errorCode = response.details[0].code.replace("_", " "); errorDetails = response.message;}
                this.setState({
                  haveError: true,
                  errorTitle: errorCode,
                  errorMsg: errorDetails
                })
            };
          });
        break;
      case "OTP":
        this.flowHandler.OTPRequest({ OTP: this.state.OTP, flowId: this.props.flowId })
          .then(response => {
            if (response.status === "COMPLETED") {
              window.location.replace(response.resumeUrl);
            } else {
              console.log("UNEXPECTED STATUS", response);
            }
          });
        break;
      case "Forgot Password":
        this.flowHandler.forgotPassword({ flowId: this.props.flowId, username: this.state.email })
        .then(response => {
          this.toggleTab('7');
        });
        break;
      case "Set New Password":
        this.flowHandler.recoverPasscode({ flowId: this.props.flowId, recoveryCode: this.state.recoveryCode, newPassword: this.state.newPassword })
        .then(response => {
          if (response.status === "OTP_REQUIRED") {
            this.flowHandler.OTPRequest({ flowId: this.props.flowId, OTP: this.state.otp })
            .then(response => {
              this.toggleTab('8')
            })
          }
          if (response.status === "COMPLETED") {
            this.restartLogin()
          } else {
            console.log("Reset Password Attempt Failed", response)
          }
        });
        break;
      case "Extraordinary Club":
      case "Google":
        console.log("authMode", authMode);
        this.flowHandler.getRequestedSocialProvider({ IdP: authMode, flowId: this.props.flowId })
          .then(idpURL => {
            console.log("authNURL", idpURL);
            window.location.assign(idpURL)
          });

        break;
      default:
        throw new Error("Unexpected authMode for ModalLoginPassword.handleUserAction.");
    }
  }
  restartLogin() {
    this.session.setAuthenticatedUserItem("authMode", "login", "session");
    const redirectURI = this.envVars.REACT_APP_HOST + this.envVars.PUBLIC_URL + "/";
    this.flowHandler.initAuthNFlow({ grantType: "authCode", clientId: this.envVars.REACT_APP_CLIENT, redirectURI: redirectURI, scopes: "openid profile email" });
    // this.modalLoginPassword.current.toggle();
  }
  componentDidMount() {
    if (this.session.getAuthenticatedUserItem("rememberMe", "local")) {
      this.setState({
        rememberme: true,
        username: this.session.getAuthenticatedUserItem("rememberMe", "local")
      });
    }
  }
  /* END PING INTEGRATION: */
  render() {
    const closeBtn = <div />;
    return (
      <div>
        <Modal autoFocus={false} isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} onClosed={this.onClosed.bind(this)} className="modal-login">
          <ModalHeader toggle={this.toggle.bind(this)} close={closeBtn}><img src={window._env_.PUBLIC_URL + "/images/logo.svg"} alt="logo" /></ModalHeader>
          <ModalBody>
            <form>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1"> {/* Username/password UI. */}
                  <h4>{data.titles.welcome}</h4>
                  {this.state.haveError && <div style={{ color: 'red' }}>{this.state.errorTitle}<br />{this.state.errorMsg}</div>} {/* PING INTEGRATION */}
                  <FormGroup className="form-group-light">
                    <Label for="username">{data.form.fields.username.label}</Label>
                    <Input autoFocus={true} autoComplete="off" onChange={this.handleFormInput.bind(this)} type="text" name="username" id="username" value={this.state.username} />
                  </FormGroup>
                  <FormPassword autoComplete="off" handleFormInput={this.handleFormInput.bind(this)} name="password" label={data.form.fields.password.label} placeholder={data.form.fields.password.placeholder} />
                  <FormGroup className="form-group-light">
                    <CustomInput onChange={this.handleFormInput.bind(this)} type="checkbox" id="rememberme" label={data.form.fields.rememberme.label} checked={this.state.rememberme} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('3'); }}>{data.form.buttons.next}</Button>
                  </div>
                  {/* <div>
                    <Button type="button" color="link" size="sm" className="text-info pl-0" onClick={() => { this.toggleTab('4'); }}>{data.form.buttons.reset}</Button>
                  </div> */}
                  <div>
                    <Button type="button" color="link" size="sm" className="text-info pl-0" onClick={() => { this.toggleTab('5'); }}>{data.form.buttons.reset_password}</Button>
                  </div>
                  <div className="text-center">
                    <img onClick={() => { this.handleUserAction("Extraordinary Club") }} src={window._env_.PUBLIC_URL + "/images/SignInEOC-500x109.png"} alt="Facebook" className="social-signup" />
                  </div>
                  <div className="text-center">
                    <img onClick={() => { this.handleUserAction("Google") }} src={window._env_.PUBLIC_URL + "/images/social-signin-google.png"} alt="Google" className="social-signup" />
                  </div>
                </TabPane>
                <TabPane tabId="2"> {/* MFA OTP IF ON */}
                  <h4>{data.mfa.buttons.login_verification}</h4>
                  {this.state.codeConfirmPending &&
                    <div className="spinner" style={{ textAlign: "center" }}>
                      <FontAwesomeIcon icon={faCircleNotch} size="3x" className="fa-spin" />
                    </div>}
                  <FormGroup className="form-group-light">
                    <Label for="OTP">{data.mfa.login_verification.label}</Label>
                    <Input onChange={this.handleFormInput.bind(this)} autoFocus={true} autoComplete="off" type="text" name="OTP" id="OTP" value={this.state.OTP} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.handleUserAction("OTP") } }>{data.mfa.buttons.login_verification}</Button>
                  </div>
                </TabPane>
                {/* <TabPane tabId="2"> PASSWORDLESS UI. NOT SUPPORTED IN BXR USE CASES.
                  <h4>{data.titles.login_method}</h4>
                  <FormGroup className={this.state.loginMethodFormGroupClass}>
                    <div>
                      <CustomInput type="radio" id="login_method_email" name="login_method" label={data.form.fields.login_method.options.email} className="form-check-inline" onClick={this.setLoginMethod.bind(this)} />
                      <CustomInput type="radio" id="login_method_text" name="login_method" label={data.form.fields.login_method.options.text} className="form-check-inline" onClick={this.setLoginMethod.bind(this)} />
                      <CustomInput type="radio" id="login_method_faceid" name="login_method" label={data.form.fields.login_method.options.faceid} className="form-check-inline" onClick={this.setLoginMethod.bind(this)} />}
                    </div>
                  </FormGroup>
                  <div className="mb-4 text-center">
                    <Button type="button" color="primary" disabled={this.state.loginMethodUnset} onClick={() => { this.toggleTab('3'); }}>{data.form.buttons.login}</Button>
                  </div>
                  <div className="text-center">
                    <Button type="button" color="link" size="sm" className="text-info" onClick={this.toggle.bind(this)}>{data.form.buttons.help}</Button>
                  </div>
                </TabPane> */}
                <TabPane tabId="3"> {/* Progress spinner UI */}
                  <div className="mobile-loading" style={{ backgroundImage: `url(${window._env_.PUBLIC_URL}/images/login-device-outline.jpg)` }}>
                    <div className="spinner">
                      <FontAwesomeIcon icon={faCircleNotch} size="3x" className="fa-spin" />
                    </div>
                    <p>{data.mobile.loading}</p>
                  </div>
                  <div className="mt-4 text-center">
                    <Button type="button" color="link" size="sm" className="text-info">{data.form.buttons.help}</Button>
                  </div>
                </TabPane>
                {/* <TabPane tabId="4"> USERNAME RECOVERY UI. PINGONE DOESN'T SUPPORT THIS TODAY.
                  <h4>{data.form.buttons.recover_username}</h4>
                  <FormGroup className="form-group-light">
                    <Label for="email">{data.form.fields.email.label}</Label>
                    <Input type="text" name="email" id="email" placeholder={data.form.fields.email.placeholder} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('6'); }}>{data.form.buttons.recover_username}</Button>
                  </div>
                </TabPane> */}
                <TabPane tabId="5"> {/* Password reset UI - enter username. */}
                  <h4>{data.form.buttons.recover_passreset_password}</h4>
                  <p>{data.forgotPassword.labels.usernameWarning}</p>
                  <FormGroup className="form-group-light">
                    <Label for="email">{data.form.fields.email.label}</Label>
                    <Input onChange={this.handleFormInput.bind(this)} autoFocus={true} autoComplete="off" type="text" name="email" id="email" placeholder={data.form.fields.email.placeholder} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.handleUserAction("Forgot Password"); }}>{data.form.buttons.recover_password}</Button>
                  </div>
                </TabPane>
                {/* <TabPane tabId="6"> USERNAME RECOVERY SUCCESS UI. SAME ISSUE AS TABID 4.
                  <h4>{data.titles.recover_username_success}</h4>
                  <div className="mb-3 text-center">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('1'); }}>{data.form.buttons.login}</Button>
                  </div>
                </TabPane> */}
                <TabPane tabId="7"> {/* Password reset UI - enter code and new password. */}
                  <h4>{data.form.buttons.reset_password}</h4>
                  <FormGroup className="form-group-light">
                    <Label for="recoveryCode">{data.forgotPassword.labels.recoveryCode}</Label>
                    <Input onChange={this.handleFormInput.bind(this)} autoFocus={true} autoComplete="off" type="text" name="recoveryCode" id="recoveryCode" />
                    <Label for="newPassword">{data.forgotPassword.labels.newPassword}</Label>
                    <Input onChange={this.handleFormInput.bind(this)} autoComplete="off" type="text" name="newPassword" id="newPassword" />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.handleUserAction("Set New Password"); }}>{data.form.buttons.recover_password}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="8"> {/* Password reset UI - if MFA enabled, enter in OTP. */}
                <h4>{data.mfa.buttons.login_verification}</h4>
                  {this.state.codeConfirmPending &&
                    <div className="spinner" style={{ textAlign: "center" }}>
                      <FontAwesomeIcon icon={faCircleNotch} size="3x" className="fa-spin" />
                    </div>}
                  <FormGroup className="form-group-light">
                    <Label for="OTP">{data.mfa.login_verification.label}</Label>
                    <Input onChange={this.handleFormInput.bind(this)} autoFocus={true} autoComplete="off" type="text" name="OTP" id="OTP" value={this.state.OTP} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.handleUserAction("OTP") } }>{data.mfa.buttons.login_verification}</Button>
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