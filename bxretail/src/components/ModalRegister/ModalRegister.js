/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

// Packages
import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Row,
  Col,
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

// Styles
import "./ModalRegister.scss";

// Data
import data from './data.json';

class ModalRegister extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      isPopoverOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  togglePopover() {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen
    });
  }
  render() {
    return (
      <div>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} className="modal-xl modal-register">
          <ModalHeader toggle={this.toggle.bind(this)}><img src="/images/logo.svg" alt="logo" /></ModalHeader>
          <ModalBody>
            <h2>{data.title}</h2>
            <Form>
              <Row form className="form-row-light">
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">{data.form.fields.email.label}</Label>
                    <Input type="email" name="email" id="email" placeholder={data.form.fields.email.placeholder} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="firstname">{data.form.fields.firstname.label}</Label>
                    <Input type="text" name="firstname" id="firstname" placeholder={data.form.fields.firstname.placeholder} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone">{data.form.fields.phone.label}</Label>
                    <Input type="tel" name="phone" id="phone" placeholder={data.form.fields.phone.placeholder} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">{data.form.fields.password.label}</Label>
                    <Input type="password" name="password" id="password" placeholder={data.form.fields.password.placeholder} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password_confirm">{data.form.fields.password_confirm.label}</Label>
                    <Input type="password" name="password_confirm" id="password_confirm" placeholder={data.form.fields.password_confirm.placeholder} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
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
                    <Input type="select" name="login" id="login">
                      <option>{data.form.fields.login.options.default}</option>
                      <option value="mobile">{data.form.fields.login.options.mobile}</option>
                      <option value="password">{data.form.fields.login.options.password}</option>
                    </Input>
                  </FormGroup>
                  <img src={process.env.PUBLIC_URL + "/images/google-recaptcha.png"} alt="Google reCAPTCHA" className="google-recaptcha" />
                  <FormGroup className="form-group-light ml-3 mb-4">
                    <CustomInput type="checkbox" id="rewards" label={data.form.fields.rewards.label} />
                  </FormGroup>
                  <div className="text-right">
                    <Button type="button" color="primary" onClick={this.props.onSubmit}>{data.form.buttons.submit}</Button>
                    <Button type="button" color="link" className="ml-3" onClick={this.toggle.bind(this)}>{data.form.buttons.cancel}</Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="text-center">
                  <img src={process.env.PUBLIC_URL + "/images/home-login-or.png"} alt="or" className="or" />
                </Col>
              </Row>
              <Row form className="form-row-light">
                <Col className="text-right">
                  <img src={process.env.PUBLIC_URL + "/images/social-signup-facebook.png"} alt="Facebook" className="social-signup mr-1" />
                </Col>
                <Col>
                  <img src={process.env.PUBLIC_URL + "/images/social-signup-google.png"} alt="Google" className="social-signup ml-1" />
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ModalRegister;
