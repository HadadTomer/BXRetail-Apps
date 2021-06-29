import React from 'react';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  CustomInput
} from 'reactstrap';

// Components
import NavbarMain from '../../../components/NavbarMain';
import WelcomeBar from '../../../components/WelcomeBar';
import FooterMain from '../../../components/FooterMain';
import AccountsSubnav from '../../../components/AccountsSubnav';
import AccountsDropdown from '../../../components/AccountsDropdown';
import FlowHandler from '../../../components/Controller/FlowHandler'; /* PING INTEGRATION: */

// Data
import data from '../../../data/dashboard/settings/privacy-security.json';
 
// Styles
import "../../../styles/pages/dashboard/settings/privacy-security.scss";

class PrivacySecurity extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      phone: false,         /* PING INTEGRATION */
      deliveryPhoneChecked: false,  /* PING INTEGRATION */
      email: false,         /* PING INTEGRATION */
      deliveryEmailChecked: false,   /* PING INTEGRATION */
      commSmsChecked: false,  /* PING INTEGRATION */
      commEmailChecked: false,  /* PING INTEGRATION */
      commMailChecked: false  /* PING INTEGRATION */
    };

    this.showStep2 = this.showStep2.bind(this);
    this.close = this.close.bind(this);
    this.toggleConsent = this.toggleConsent.bind(this);
    this.flowHandler = new FlowHandler();
  }

  showStep2() {
    // Sends the user's consent selections to state to be sent to FlowHandler.
    // this.flowHandler.userUpdateConsent({ consentData: this.state });
    this.setState({step: 2});
  }

  close() {
    this.setState({step: 1});
  }

  toggleConsent(event) {
    let consentState = {};
    let checkedState = {};
    const delimiterPos = event.target.id.indexOf("_");
    consentState[event.target.id.substring(0, delimiterPos)] = event.target.id.substring(delimiterPos + 1) === "yes" ? true : false;
    this.setState(consentState);
    checkedState[event.target.id.substring(0, delimiterPos) + "Checked"] = event.target.id.substring(delimiterPos + 1) === "yes" ? true : false;
    this.setState(checkedState);
  }

  componentDidMount() {
    const response = this.flowHandler.userGetConsent();
    console.log("User Consent Data", response); 
    if (response.consent) {
      const deliveryConsent = response.consent.find(consent => consent["definition"]["id"] === "tv-delivery-preferences");
      if (deliveryConsent) {
        this.state.deliveryEmailChecked = deliveryConsent.email;
        this.state.deliveryPhoneChecked = deliveryConsent.phone;
      } 
      const commConsent = response.consent.find(consent => consent["definition"]["id"] === "communication-preferences");
      if (commConsent) {
        this.state.commSmsChecked = commConsent.sms;
        this.state.commEmailChecked = commConsent.email;
        this.state.commMailChecked = commConsent.mail;
      }
    }
  }

  render() {
    let commDetails, commType;
    return(
      <div className="accounts privacy-security">
        <NavbarMain />
        <WelcomeBar title="My Account" />
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
              { this.state.step === 1 && 
                <div className="module module-step1">
                  <h2>{data.steps[0].title}</h2>
                  <p>{data.steps[0].description}</p>
                  <h3>{data.steps[0].table_title}</h3>
                  <Form>
                    {
                      Object.keys(data.steps[0].communication_types).map(index => {
                        {/* TODO implement when we have session data:
                        commDetails = data.steps[0].communication_types[index].name === "phone" ? this.Session.getAuthenticatedUserItem("mobile") && data.steps[0].communication_types[index].name === "email"; */}
                        commDetails = data.steps[0].communication_types[index].name === "phone" ? "314.787.2278" : data.steps[0].communication_types[index].name === "email" ? "janelakesmith@gmail.com": "";
                        commType = data.steps[0].communication_types[index].name;
                        return (
                          <div>
                            <FormGroup>
                              {/* PING INTEGRATION: modified label to display user data and added onClicks to CustomInput */}
                              {/* TODO need to update label? */}
                              <Label for={data.steps[0].communication_types[index].name}>{data.steps[0].communication_types[index].label + ' (' + commDetails + ')'}</Label>
                              <CustomInput onChange={(event) => this.toggleConsent(event)} type="radio" id={`${data.steps[0].communication_types[index].name}_yes`} name={data.steps[0].communication_types[index].name} label="Yes" checked={this.state[commType + "Checked"]}/>
                              <CustomInput onChange={(event) => this.toggleConsent(event)} type="radio" id={`${data.steps[0].communication_types[index].name}_no`} name={data.steps[0].communication_types[index].name} label="No" checked={!this.state[commType + "Checked"]}/>
                            </FormGroup>
                          </div>
                        );
                      })      
                    }
                    <FormGroup className="buttons submit-buttons">
                      <Button color="primary" onClick={ this.showStep2 }>Save</Button>
                      <a href={window._env_.PUBLIC_URL + "/dashboard/settings"} className="cancel">Cancel</a>
                    </FormGroup>
                  </Form>
                </div>
              }
              { this.state.step === 2 && 
                <div className="module module-step2">
                  <h2 className="confirmation">{data.steps[1].title}</h2>
                  <p>{data.steps[1].description}</p>
                  <h3>{data.steps[0].table_title}</h3>
                  <Form>
                    {
                      Object.keys(data.steps[1].communication_types).map(index => {
                        {/* TODO implement when we have session data:
                        commDetails = data.steps[0].communication_types[index].name === "phone" ? this.Session.getAuthenticatedUserItem("mobile") : data.steps[0].communication_types[index].name === "email" ? this.Session.getAuthenticatedUserItem("email") : this.Session.getAuthenticatedUserItem("fullAddress"); */}
                        commDetails = data.steps[0].communication_types[index].name === "phone" ? "314.787.2278" : data.steps[0].communication_types[index].name === "email" ?  "janelakesmith@gmail.com" : "";
                        commType = data.steps[0].communication_types[index].name;
                        return (
                          <>
                            <FormGroup>
                              <Label for={data.steps[1].communication_types[index].name}>{data.steps[0].communication_types[index].label + ' (' + commDetails + ')'}</Label>
                              <CustomInput type="radio" id={`${data.steps[0].communication_types[index].name}_yes`} name={data.steps[0].communication_types[index].name} label="Yes" disabled checked={this.state[commType + "Checked"]}/>
                              <CustomInput type="radio" id={`${data.steps[0].communication_types[index].name}_no`} name={data.steps[0].communication_types[index].name} label="No" disabled checked={!this.state[commType + "Checked"]}/>
                            </FormGroup>
                          </>
                        );
                      })
                    }
                    <div dangerouslySetInnerHTML={{__html:data.steps[1].other_things}} />
                    <FormGroup className="buttons submit-buttons">
                      <Button color="primary" onClick={ this.close }>{data.steps[1].btn_back}</Button>
                    </FormGroup>
                  </Form>
                </div>
              }
            </div>
          </div>
        </Container>
        <FooterMain />
      </div>
    )
  }
}
export default PrivacySecurity;