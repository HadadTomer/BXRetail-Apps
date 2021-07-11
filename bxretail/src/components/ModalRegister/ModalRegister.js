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
  CustomInput,
  Input,
  Row,
  Col,
  TabContent, TabPane
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

// Styles
import "./ModalRegister.scss";

// Data
import data from './data.json';

// Components
import FormPassword from '../../components/FormPassword';
import FlowHandler from '../Controller/FlowHandler'; /* PING INTEGRATION: */

class ModalRegister extends React.Component {

  constructor() {
    super();
    this.state = {
      isOpen: false,
      isPopoverOpen: false,
      activeTab: "1",  /* PING INTEGRATION: */
      codeConfirmPending: false /* PING INTEGRATION: */
    };
    this.envVars = window._env_;
    this.flowHandler = new FlowHandler();
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
  togglePopover() {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen
    });
  }

  /* BEGIN PING INTEGRATION: */
   
  handleFormInput(e) {
    //Update state based on the input's Id and value.
    let formData = {};
    formData[e.target.id] = e.target.value;
    this.setState(formData);
  }

  handleUserAction(authMode) {
    switch (authMode) {
      case "registration":
        this.setState({ codeConfirmPending: true});
        console.log("made it to reg");
        // FIXME just like the fix me comment on tabId 7. This soooo doesn't belong in this component. KMN.
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
      default:
        throw new Error("Unexpected authMode for ModalLoginPassword.handleUserAction.");
    }
  }
  /* END PING INTEGRATION: */

  render() {
    return (
      <div>
        <Modal autoFocus={false} isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} className="modal-xl modal-register">
          <ModalHeader toggle={this.toggle.bind(this)}><img src={window._env_.PUBLIC_URL + "/images/logo.svg"} alt="logo" /></ModalHeader>
          <ModalBody>
            <h2>{data.title}</h2>
            <form>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1"> {/* Registration UI. */}
                  <Row form className="form-row-light">
                    <Col md={12}>
                      <FormGroup>
                        <Label for="email">{data.form.fields.email.label}</Label>
                        <Input onChange={this.props.handleFormInput} autoFocus={true} autoComplete="off" type="email" name="email" id="email" placeholder={data.form.fields.email.placeholder} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form className="form-row-light">
                    <Col md={12}>
                      <FormPassword handleFormInput={this.props.handleFormInput} autoComplete="off" name="password" label={data.form.fields.password.label} placeholder={data.form.fields.password.placeholder} />
                      {/* <FormGroup>
                    <Label for="password">{data.form.fields.password.label}</Label>
                    <Input onChange={this.props.handleFormInput} type="password" name="password" id="password" placeholder={data.form.fields.password.placeholder} />
                  </FormGroup> */}
                      {/* <FormGroup>
                    <Label for="firstname">{data.form.fields.firstname.label}</Label>
                    <Input onChange={this.props.handleFormInput} type="text" name="firstname" id="firstname" placeholder={data.form.fields.firstname.placeholder} />
                  </FormGroup> */}
                      {/* <FormGroup>
                    <Label for="phone">{data.form.fields.phone.label}</Label>
                    <Input onChange={this.props.handleFormInput} type="tel" name="phone" id="phone" placeholder={data.form.fields.phone.placeholder} />
                    <FormText>{data.form.fields.phone.requirements}</FormText>
                  </FormGroup> */}
                    </Col>
                  </Row>
                  <Row form className="form-row-light">
                    <Col md={12}>
                      <FormPassword handleFormInput={this.props.handleFormInput} autoComplete="off" name="password_confirm" label={data.form.fields.password_confirm.label} placeholder={data.form.fields.password_confirm.placeholder} />
                      {/* <FormGroup>
                    <Label for="password_confirm">{data.form.fields.password_confirm.label}</Label>
                    <Input onChange={this.props.handleFormInput} type="password" name="password_confirm" id="password_confirm" placeholder={data.form.fields.password_confirm.placeholder} />
                    <FormText>{data.form.fields.password_requirements.text}</FormText>
                  </FormGroup> */}
                      {/* CAN'T DO TRUE OPT-IN PASSWORDLESS IN P1 YET. SEE PROFILE MGMT TO OPT-IN FOR PASSWORD + MFA OPT-IN. */}
                      {/* <FormGroup> 
                    <Label for="login">
                      {data.form.fields.login.label}
                      <Button id="Popover1" color="link" type="button">
                        <FontAwesomeIcon icon={faQuestionCircle} />
                      </Button>
                      <Popover placement="right" isOpen={this.state.isPopoverOpen} target="Popover1" toggle={this.togglePopover.bind(this)}>
                        <PopoverHeader>{data.form.fields.login.popover.title}</PopoverHeader>
                        <PopoverBody>{data.form.fields.login.popover.content}</PopoverBody>
                      </Popover>
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Input onChange={this.props.handleFormInput} type="select" name="login" id="login">
                      <option>{data.form.fields.login.options.default}</option>
                      <option value="mobile">{data.form.fields.login.options.mobile}</option>
                      <option value="password">{data.form.fields.login.options.password}</option>
                    </Input>
                  </FormGroup>
                  
                  <img src={window._env_.PUBLIC_URL + "/images/google-recaptcha.png"} alt="Google reCAPTCHA" className="google-recaptcha" /> 
                  Removed since we don't offer reCAPTCHA - didn't want to mislead in the demo.
                   
                  <FormGroup className="form-group-light ml-3 mb-4">
                    <CustomInput type="checkbox" id="rewards" label={data.form.fields.rewards.label} />
                  </FormGroup>*/}
                    </Col>
                  </Row>
                  <Row form className="form-row-light">
                    <Col md={12}>
                      <div className="text-center">
                        <Button type="button" color="primary" onClick={this.props.onSubmit}>{data.form.buttons.submit}</Button>
                        <Button type="button" color="link" className="ml-3" onClick={this.toggle.bind(this)}>{data.form.buttons.cancel}</Button>
                      </div>
                    </Col>
                  </Row>
                  <Row form className="form-row-light">
                    <Col className="text-center">
                      <img src={window._env_.PUBLIC_URL + "/images/home-login-or.png"} alt="or" className="or" />
                    </Col>
                  </Row>
                  <Row form className="form-row-light">
                    <Col className="text-center">
                      <img src={window._env_.PUBLIC_URL + "/images/SignUpEOC-500x109.png"} alt="Facebook" className="social-signup mr-1" />
                    </Col>
                  </Row>
                  <Row form className="form-row-light">
                    <Col className="text-center">
                      <img src={window._env_.PUBLIC_URL + "/images/social-signup-google.png"} alt="Google" className="social-signup mr-1" />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2"> {/* Registration email verification code UI. */}
                  <h4>{data.form.buttons.reg_verification}</h4>
                  {this.state.codeConfirmPending &&
                    <div className="spinner" style={{ textAlign: "center" }}>
                      <FontAwesomeIcon icon={faCircleNotch} size="3x" className="fa-spin" />
                    </div>}
                  <FormGroup className="form-group-light">
                    <Label for="regCode">{data.form.fields.regVerification.label}</Label>
                    <Input onChange={this.handleFormInput.bind(this)} autoFocus={true} autoComplete="off" type="text" name="regCode" id="regCode" value={this.state.regCode} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.handleUserAction("registration") } }>{data.form.buttons.reg_verification}</Button>
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

export default ModalRegister;