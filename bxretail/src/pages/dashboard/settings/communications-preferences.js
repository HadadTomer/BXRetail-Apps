import React from 'react';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  CustomInput,
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
import data from '../../../data/dashboard/settings/communication-preferences.json';
 
// Styles
import "../../../styles/pages/dashboard/settings/communication-preferences.scss";

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
      <div className="accounts communication-preferences">
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
              { this.state.step == 1 &&
                <div className="module module-step1">
                  <h2>{data.steps[0].title}</h2>
                  <p>{data.steps[0].description}</p>
                  <h3>{data.steps[0].table_title}</h3>
                  <Form>
                    {
                      Object.keys(data.steps[0].communication_types).map(index => {
                        return (
                          <>
                            <FormGroup className={classNames({ "gray": (index % 2) })}>
                              <Label for={data.steps[0].communication_types[index].name}>{data.steps[0].communication_types[index].label}</Label>
                              <CustomInput type="radio" id={`${data.steps[0].communication_types[index].name}_yes`} name={data.steps[0].communication_types[index].name} label="Yes" />
                              <CustomInput type="radio" id={`${data.steps[0].communication_types[index].name}_no`} name={data.steps[0].communication_types[index].name} checked label="No" />
                            </FormGroup>
                          </>
                        );
                      })      
                    }
                    <FormGroup className="buttons submit-buttons">
                      <Button color="primary" onClick={ this.showStep2 }>Save</Button>
                      <a href="/dashboard/settings" className="cancel">Cancel</a>                        
                    </FormGroup>
                  </Form>
                </div>
              }
              { this.state.step == 2 &&                  
                <div className="module module-step2">
                  <h2 className="confirmation">{data.steps[1].title}</h2>
                  <p>{data.steps[1].description}</p>  
                  <h3>{data.steps[0].table_title}</h3>
                  <Form>
                    {
                      Object.keys(data.steps[1].communication_types).map(index => {
                        return (
                          <>
                            <FormGroup className={classNames({ "gray": (index % 2) })}>
                              <Label for={data.steps[0].communication_types[index].name}>{data.steps[0].communication_types[index].label}</Label>
                              <CustomInput type="radio" disabled id={`${data.steps[0].communication_types[index].name}_yes`} name={data.steps[0].communication_types[index].name} label="Yes" />
                              <CustomInput type="radio" disabled id={`${data.steps[0].communication_types[index].name}_no`} name={data.steps[0].communication_types[index].name} checked label="No" />
                            </FormGroup>
                          </>
                        );
                      })      
                    }
                    <div dangerouslySetInnerHTML={{__html: data.steps[1].other_things}} />                    
                    <FormGroup className="buttons submit-buttons">
                      <Button color="primary" onClick={ this.showStep1 }>{data.steps[1].btn_back}</Button>
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