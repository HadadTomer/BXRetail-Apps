import React from 'react';
import {
  Container,
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from 'reactstrap';

// Components
import NavbarMain from '../../../components/NavbarMain';
import WelcomeBar from '../../../components/WelcomeBar';
import FooterMain from '../../../components/FooterMain';
import AccountsSubnav from '../../../components/AccountsSubnav';
import AccountsDropdown from '../../../components/AccountsDropdown';
import FlowHandler from '../../../components/Controller/FlowHandler'; /* PING INTEGRATION: */
import Session from '../../../components/Utils/Session'; /* PING INTEGRATION: */

// Data
import data from '../../../data/dashboard/settings/profile.json';
 
// Styles
import "../../../styles/pages/dashboard/settings/profile.scss";

class CommunicationPreferences extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      firstname: "",
      lastname: "",
      fullname: "",
      email: "",
      phone: "",
      birthdate: "",
      street: "",
      city: "",
      zipcode: "",
      success: false,
      mfaEnabled: false,
    };

    this.showStep2 = this.showStep2.bind(this);
    this.close = this.close.bind(this);
    this.flowHandler = new FlowHandler();
    this.session = new Session();
  }

  showStep2() {
    const success = this.flowHandler.updateUserProfile({ IdT: this.session.getAuthenticatedUserItem("IdT", "session"), userState: this.state })
    this.setState({
      step: 2, 
      success: success
    }); 
    setTimeout( () => { this.setState({ success: false }) } , 2500);
  }

  close() {
    this.setState({step: 1});
  }

  handleUserInput(e) {
    let formData = {};
    formData[e.target.id] = e.target.value;
    this.setState(formData, () => { console.log("formData", formData) });
  }

  handleCheckbox() {
    const enabled = !this.state.mfaEnabled;
    this.flowHandler.toggleMFA({ IdT: this.session.getAuthenticatedUserItem("IdT", "session"), toggleState: enabled });
    this.setState({mfaEnabled: enabled});
  }

  componentDidMount() {
    this.flowHandler.getUserProfile({ IdT: this.session.getAuthenticatedUserItem("IdT", "session") })
      .then(userProfile => {
        if (userProfile.name === undefined) {
          return;
        }
        this.setState({
          firstname: userProfile.name.given,
          lastname: userProfile.name.family,
          fullname: userProfile.name.given + " " + userProfile.name.family,
          email: userProfile.email,
          phone: userProfile.mobilePhone,
          birthdate: userProfile.BXRetailCustomAttr1,
          street: userProfile.address.streetAddress,
          city: userProfile.address.locality,
          zipcode: userProfile.address.postalCode,
          mfaEnabled: userProfile.mfaEnabled
        });
      });
  };

  render() {
    return(
      <div className="accounts profile">
        <NavbarMain />
        <WelcomeBar title="My Account: " fullName={this.session.getAuthenticatedUserItem("fullName", "session")} email={this.session.getAuthenticatedUserItem("email", "session")} />
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
                      <Input onChange={this.handleUserInput.bind(this)} type="text" autoComplete="new-firstname" name="firstname" id="firstname" placeholder={data.form.fields.firstname.placeholder} value={this.state.firstname} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="lastname">{data.form.fields.lastname.label}</Label>
                      <Input onChange={this.handleUserInput.bind(this)} type="text" autoComplete="new-lastname" name="lastname" id="lastname" placeholder={data.form.fields.lastname.placeholder} value={this.state.lastname} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="fullname">{data.form.fields.fullname.label}</Label>
                      <Input onChange={this.handleUserInput.bind(this)} type="text" autoComplete="new-fullname" name="fullname" id="fullname" placeholder={data.form.fields.fullname.placeholder} value={this.state.fullname} />
                    </FormGroup>
                  </Col>
                  {/* Hiding email since we already have it and don't want them to update it to something different than their username. */}
                  {/* <Col md={4}> 
                    <FormGroup>
                      <Label for="email">{data.form.fields.email.label}</Label>
                      <Input onChange={this.handleUserInput.bind(this)} type="email" autoComplete="new-email" name="email" id="email" placeholder={data.form.fields.email.placeholder} value={this.state.email} />
                    </FormGroup>
                  </Col> */}
                  <Col md={4}>
                    <FormGroup>
                      <Label for="phone">{data.form.fields.phone.label}</Label>
                      <Input onChange={this.handleUserInput.bind(this)} type="tel" autoComplete="new-phone" name="phone" id="phone" placeholder={data.form.fields.phone.placeholder} value={this.state.phone} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="birthdate">{data.form.fields.birthdate.label}</Label>
                      <Input onChange={this.handleUserInput.bind(this)} type="text" autoComplete="new-birthdate" name="birthdate" id="birthdate" placeholder={data.form.fields.birthdate.placeholder} value={this.state.birthdate} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="street">{data.form.fields.street.label}</Label>
                      <Input onChange={this.handleUserInput.bind(this)} type="text" autoComplete="new-street" name="street" id="street" placeholder={data.form.fields.street.placeholder} value={this.state.street}/>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="city">{data.form.fields.city.label}</Label>
                      <Input onChange={this.handleUserInput.bind(this)} type="text" autoComplete="new-city" name="city" id="city" placeholder={data.form.fields.city.placeholder} value={this.state.city} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="zipCode">{data.form.fields.zipcode.label}</Label>
                      <Input onChange={this.handleUserInput.bind(this)} type="text" autoComplete="new-zipcode" name="zipcode" id="zipcode" placeholder={data.form.fields.zipcode.placeholder} value={this.state.zipcode}/>
                    </FormGroup>
                  </Col>
                </Row>
                {/* Removed as Retailers typically aren't setting approval limits, banks are. Also didn't want to add logic around this being editable.
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
                */}
                <Row form>
                  <Col>
                    <div className="text-right">
                    { this.state.success && <p>Updated!</p> }
                      <Button type="button" color="link" className="ml-3">{data.form.buttons.cancel}</Button>
                      <Button type="button" color="primary" onClick={ this.showStep2 }>{data.form.buttons.submit}</Button>
                    </div>
                  </Col>
                </Row>
              </div>
               <div className="module">
                <h3>Authentication Preferences</h3>
                <Col>
                  <Row>
                    <p>{data.form.fields.login.description}</p>
                  </Row>
                </Col>
                <Col md={{ span: 1, offset: 1 }}>
                  <Row form>
                    <FormGroup>
                    <Input type="checkbox" checked={this.state.mfaEnabled} onChange={this.handleCheckbox.bind(this)}> </Input>
                    <Label>{this.state.mfaEnabled ? "Turn off two-factor authentication." : "Turn on two-factor authentication."}</Label>
                    </FormGroup>
                  </Row>
                </Col>
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