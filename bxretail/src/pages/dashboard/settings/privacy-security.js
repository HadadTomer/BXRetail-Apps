import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput
} from 'reactstrap';

// Components
import NavbarMain from '../../../components/NavbarMain';
import WelcomeBar from '../../../components/WelcomeBar';
import FooterMain from '../../../components/FooterMain';
import AccountsSubnav from '../../../components/AccountsSubnav';
import AccountsDropdown from '../../../components/AccountsDropdown';

// Data
import data from '../../../data/dashboard/settings/privacy-security.json';
 
// Styles
import "../../../styles/pages/dashboard/settings/privacy-security.scss";

class PrivacySecurity extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      step: 1
    };

    this.showStep1 = this.showStep1.bind(this);
    this.showStep2 = this.showStep2.bind(this);
    this.close = this.close.bind(this);
  }

  showStep1() {
    this.setState({step: 1});
  }

  showStep2() {
    this.setState({step: 2});
  }

  close() {
    this.setState({step: 1});
  }

  render() {
    return(
      <div className="accounts privacy-security">
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
                <div className="edit">
                  <h2>{data.form.title}</h2>
                  <p>{data.form.description}</p>
                  <Form>
                    {
                      Object.keys(data.form.communication_types).map(index => {
                        return (
                          <div>
                            <FormGroup>
                              <Label for={data.form.communication_types[index].name}>{data.form.communication_types[index].label}</Label>
                              <CustomInput type="radio" id={`${data.form.communication_types[index].name}_yes`} name={data.form.communication_types[index].name} label="Yes" />
                              <CustomInput type="radio" id={`${data.form.communication_types[index].name}_no`} name={data.form.communication_types[index].name} checked label="No" />
                            </FormGroup>
                          </div>
                        );
                      })      
                    }
                  </Form>
                  <p><a href="#" className="btn btn-link">{data.form.button_edit}</a></p>
                  <p><a href="#" className="btn btn-link">{data.form.button_partners}</a></p>
                </div>
              </div>
            </div>
          </div>
        </Container>
        <FooterMain />
      </div>
    )
  }
}
export default PrivacySecurity