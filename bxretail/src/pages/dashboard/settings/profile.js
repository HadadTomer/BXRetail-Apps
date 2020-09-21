import React from 'react';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Row,
  Col
} from 'reactstrap';
import classNames from "classnames";

// Components
import NavbarMain from '../../../components/NavbarMain';
import WelcomeBar from '../../../components/WelcomeBar';
import FooterMain from '../../../components/FooterMain';
import AccountsSubnav from '../../../components/AccountsSubnav';
import AccountsDropdown from '../../../components/AccountsDropdown';
import AccountsSectionNav from '../../../components/AccountsSectionNav';

// Data
import data from '../../../data/dashboard/settings/profile.json';
 
// Styles
import "../../../styles/pages/dashboard/settings/profile.scss";

class CommunicationPreferences extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      step: 1
    };

    this.showStep2 = this.showStep2.bind(this);
    this.close = this.close.bind(this);
  }

  showStep2() {
    this.setState({step: 2});
  }

  close() {
    this.setState({step: 1});
  }

  render() {
    return(
      <div className="accounts profile">
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
              <div className="module">
                <h3>Profile Details</h3>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="firstname">{data.form.fields.firstname.label}</Label>
                      <Input type="text" name="firstname" id="firstname" placeholder={data.form.fields.firstname.placeholder} value={data.form.fields.firstname.value} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="lastname">{data.form.fields.lastname.label}</Label>
                      <Input type="text" name="lastname" id="lastname" placeholder={data.form.fields.lastname.placeholder} value={data.form.fields.lastname.value} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="fullname">{data.form.fields.fullname.label}</Label>
                      <Input type="text" name="fullname" id="fullname" placeholder={data.form.fields.fullname.placeholder} value={data.form.fields.fullname.value} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="email">{data.form.fields.email.label}</Label>
                      <Input type="email" name="email" id="email" placeholder={data.form.fields.email.placeholder} value={data.form.fields.email.value} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="phone">{data.form.fields.phone.label}</Label>
                      <Input type="tel" name="phone" id="phone" placeholder={data.form.fields.phone.placeholder} value={data.form.fields.phone.value} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="birthdate">{data.form.fields.birthdate.label}</Label>
                      <Input type="text" name="birthdate" id="birthdate" placeholder={data.form.fields.birthdate.placeholder} value={data.form.fields.birthdate.value} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="street">{data.form.fields.street.label}</Label>
                      <Input type="text" name="street" id="street" placeholder={data.form.fields.street.placeholder} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="city">{data.form.fields.city.label}</Label>
                      <Input type="text" name="city" id="city" placeholder={data.form.fields.city.placeholder} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="zipcode">{data.form.fields.zipcode.label}</Label>
                      <Input type="text" name="zipcode" id="zipcode" placeholder={data.form.fields.zipcode.placeholder} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="city">{data.form.fields.login.label}</Label>
                      <Input type="select" name="login" id="login">
                        <option value="mobile">{data.form.fields.login.options.mobile}</option>
                        <option value="password">{data.form.fields.login.options.password}</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <h3>Transaction Approvals</h3>
                <Row form>
                  <Col md={5}>
                    <FormGroup>
                      <Label for="transactions">{data.form.fields.transactions.label}</Label>
                    </FormGroup>
                  </Col>
                  <Col md={5}>
                    <FormGroup>
                      <Input type="text" name="transactions" id="transactions" placeholder={data.form.fields.transactions.placeholder} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col>
                    <div className="text-right">
                      <Button type="button" color="link" className="ml-3">{data.form.buttons.cancel}</Button>
                      <Button type="button" color="primary" onClick={this.props.onSubmit}>{data.form.buttons.submit}</Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Container>
        <FooterMain />
      </div>
    )
  }
}
export default CommunicationPreferences