import React from 'react';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  CustomInput,
} from 'reactstrap';

// Components
import NavbarMain from '../../../components/NavbarMain';
import WelcomeBar from '../../../components/WelcomeBar';
import FooterMain from '../../../components/FooterMain';
import AccountsSubnav from '../../../components/AccountsSubnav';
import AccountsDropdown from '../../../components/AccountsDropdown';

// Data
import data from '../../../data/dashboard/settings/communication-preferences.json';
 
// Styles
import "../../../styles/pages/dashboard/settings/communication-preferences.scss";
import classNames from 'classnames';

class CommunicationPreferences extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      radioButtons: [
        {
          name: "sms",
          label: "SMS/Text Messages",
          checkedId: "sms_no"
        },
        {
          name: "email",
          label: "Email",
          checkedId: "email_no"
        },
        {
          name: "mail",
          label: "Mail",
          checkedId: "mail_no"
        }
      ]
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

  toggleConsent(event) {
    const id = event.target.id;

    const delimiterPos = id.indexOf("_");
    const name = id.substring(0, delimiterPos);
    const index = this.state.radioButtons.map(e => e.name).indexOf(name);
    const newButtons = this.state.radioButtons;
    newButtons[index].checkedId = id;

    this.setState({
      radioButtons: newButtons
    })
  }

  render() {
    {/* TODO more variables here? */}
    return(
      <div className="accounts communication-preferences">
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
                        {/* TODO Need more inputs here */}
                        return (
                          <>
                            <FormGroup className={classNames({ "gray": (index % 2) })}>
                              {/* PING INTEGRATION: modified label to display user data and added onClicks to CustomInput */}
                              {/* TODO need to update label? */}
                              <Label for={this.state.radioButtons[index].name}>{this.state.radioButtons[index].label}</Label>
                              <CustomInput onChange={(event) => this.toggleConsent(event)} type="radio" id={`${this.state.radioButtons[index].name}_yes`} name={this.state.radioButtons[index].name} label="Yes" checked={this.state.radioButtons[index].checkedId == this.state.radioButtons[index].name + "_yes"}/>
                              <CustomInput onChange={(event) => this.toggleConsent(event)} type="radio" id={`${this.state.radioButtons[index].name}_no`} name={this.state.radioButtons[index].name} label="No" checked={this.state.radioButtons[index].checkedId == this.state.radioButtons[index].name + "_no"}/>
                            </FormGroup>
                          </>
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
                  <Form>
                    {
                      Object.keys(data.steps[1].communication_types).map(index => {
                        {/* TODO How do we preserve the consents in here? */}
                        return (
                          <>
                            <FormGroup className={classNames({ "gray": (index % 2) })}>
                              <Label for={this.state.radioButtons[index].name}>{this.state.radioButtons[index].label}</Label>
                              <CustomInput type="radio" id={`${this.state.radioButtons[index].name}_yes`} name={this.state.radioButtons[index].name} label="Yes" checked={this.state.radioButtons[index].checkedId == this.state.radioButtons[index].name + "_yes"}/>
                              <CustomInput type="radio" id={`${this.state.radioButtons[index].name}_no`} name={this.state.radioButtons[index].name} label="No" checked={this.state.radioButtons[index].checkedId == this.state.radioButtons[index].name + "_no"}/>
                            </FormGroup>
                          </>
                        );
                      })      
                    }
                    <div dangerouslySetInnerHTML={{__html: data.steps[1].other_things}} />                    
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
export default CommunicationPreferences