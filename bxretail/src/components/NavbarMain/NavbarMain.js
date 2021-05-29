// Packages
import React from 'react';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { Link, NavLink as RRNavLink } from 'react-router-dom';

// Components
import ModalRegister from '../ModalRegister';
import ModalRegisterConfirm from '../ModalRegisterConfirm';
// import ModalLogin from '../ModalLogin';
import ModalLoginPassword from '../ModalLoginPassword';
import Session from '../Utils/Session'; /* PING INTEGRATION: */
import FlowHandler from '../Controller/FlowHandler';

// Styles
import './NavbarMain.scss';

// Data
import data from './data.json';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';

class NavbarMain extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      email: "",            /* PING INTEGRATION: */
      firstname: "",        /* PING INTEGRATION: */
      phone: "",            /* PING INTEGRATION: */
      password: "",         /* PING INTEGRATION: */
      password_confirm: "", /* PING INTEGRATION: */
      /*login: "",             PING INTEGRATION: */
      flowId: ""            /* PING INTEGRATION: */
    };

    this.Session = new Session(); /* PING INTEGRATION: */
    this.envVars = window._env_; /* PING INTEGRATION: */
    this.FlowHandler = new FlowHandler(); /* PING INTEGRATION: */
    this.modalRegister = React.createRef();
    this.modalRegisterConfirm = React.createRef();
    this.modalLoginPassword = React.createRef();
  }

  triggerModalRegister() {
    this.Session.setAuthenticatedUserItem("authMode", "Registration", "local");
    const redirectURI = this.envVars.REACT_APP_HOST + this.envVars.PUBLIC_URL + "/";
    this.FlowHandler.initAuthNFlow({ grantType: "authCode", clientId: this.envVars.REACT_APP_CLIENT, redirectURI: redirectURI, scopes: "openid profile email" });
    // this.modalRegister.current.toggle(); //Moved to componentDidMount because we have to send them to P1 first.
  }
  // Sent as callback to ModalRegister.js
  onModalRegisterSubmit() {
    this.FlowHandler.registerUser({regData:this.state})
      .then(status => {
        console.log("STATUS", status);
        if (status === "VERIFICATION_CODE_REQUIRED") {
          this.modalLoginPassword.current.toggle("7");
        }
      });
    this.modalRegister.current.toggle();
    // this.modalRegisterConfirm.current.toggle();
  }
  triggerModalRegisterConfirm() {
    this.modalRegisterConfirm.current.toggle();
  }
  // Not doing identifier first in BXR
  /* triggerModalLogin() {
    this.refs.modalLogin.toggle();
  } */
  triggerModalLoginPassword() {
    this.Session.setAuthenticatedUserItem("authMode", "Login", "local");
    const redirectURI = this.envVars.REACT_APP_HOST + this.envVars.PUBLIC_URL + "/";
    this.FlowHandler.initAuthNFlow({ grantType: "authCode", clientId: this.envVars.REACT_APP_CLIENT, redirectURI: redirectURI, scopes: "openid profile email" });
    // this.modalLoginPassword.current.toggle();
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  /* BEGIN PING INTEGRATION: */
  handleFormInput(e) {
    //Update state based on the input's Id and value.
    let formData = {};
    formData[e.target.id] = e.target.value;
    this.setState(formData, () => {
      //console.log("STATE:", this.state);
    });
  }
  componentDidMount() {
    const isLoggedOut = (this.Session.getAuthenticatedUserItem("subject") === null || this.Session.getAuthenticatedUserItem("subject") === 'undefined') ? true : false;
    //TODO this is commented out until we have login working.
    // this.Session.protectPage(isLoggedOut, window.location.pathname, this.Session.getAuthenticatedUserItem("bxFinanceUserType"));

    if (window.location.search) {
      const queryParams = new URLSearchParams(window.location.search);
      const flowId = queryParams.get("flowId");
      this.setState({ flowId: flowId });
      if (this.Session.getAuthenticatedUserItem("authMode", "local") === "Login") {
        this.modalLoginPassword.current.toggle();
      } else {
        this.modalRegister.current.toggle();
      }
      // this.modalRegisterConfirm.current.toggle();
    }
  }

  /* END PING INTEGRATION: */
  render() {
    return (
      <section className="navbar-main">
        {/* DESKTOP NAV */}
        <Navbar color="dark" dark expand="md" className="navbar-desktop">
          <Container>
            <Link to="/" className="navbar-brand"><img src={window._env_.PUBLIC_URL + "/images/logo-white.svg"} alt={data.brand} /></Link>
            <NavbarToggler onClick={this.toggle.bind(this)} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="justify-content-end ml-auto navbar-nav-utility" navbar>
                <NavItem>
                  <NavLink><img src={window._env_.PUBLIC_URL + "/images/navbar-search.png"} alt={data.menus.utility.search} className="searchbar" /></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink><img src={window._env_.PUBLIC_URL + "/images/icons/map-marker.svg"} alt={data.menus.utility.locations} /></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink><img src={window._env_.PUBLIC_URL + "/images/icons/cart.svg"} alt={data.menus.utility.cart} /></NavLink>
                </NavItem>
                <NavItem className="login">
                  <NavLink href="#" onClick={this.triggerModalLoginPassword.bind(this)}><img src={window._env_.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.login} className="mr-1" /> {data.menus.utility.login}</NavLink>
                </NavItem>
                <NavItem className="logout d-none">
                  <Link to="/" className="nav-link"><img src={window._env_.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.logout}</Link>
                </NavItem>
                <NavItem className="register">
                  <NavLink href="#" onClick={this.triggerModalRegister.bind(this)}>{data.menus.utility.register_intro} <strong>{data.menus.utility.register}</strong></NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Navbar color="dark" dark expand="md" className="navbar-desktop">
          <Container>
            <Nav className="mr-auto navbar-nav-main" navbar>
              {this.props && this.props.data && this.props.data.menus && this.props.data.menus.primary ? (
                this.props.data.menus.primary.map((item, i) => {
                  return (
                    <NavItem key={i}>
                      <NavLink to={item.url} activeClassName="active" exact tag={RRNavLink}>{item.title}</NavLink>
                    </NavItem>
                  );
                })
              ) : (
                data.menus.primary.map((item, i) => {
                  return (
                    <NavItem key={i}>
                      <NavLink to={item.url} activeClassName="active" tag={RRNavLink}>{item.title}</NavLink>
                    </NavItem>
                  );
                })
              )}
            </Nav>
          </Container>
        </Navbar>
        {/* MOBILE NAV */}
        <Navbar color="dark" dark expand="md" className="navbar-mobile">
          <div className="mobilenav-menu">
            <NavbarToggler onClick={this.toggle.bind(this)} />
          </div>
          <div className="mobilenav-brand">
            <Link to="/" className="navbar-brand"><img src={window._env_.PUBLIC_URL + "/images/logo-white.svg"} alt={data.brand} /></Link>
          </div>
          <div className="mobilenav-login">
            <NavLink href="#" className="login" onClick={this.triggerModalLoginPassword.bind(this)}>Sign In</NavLink>
            <Link to="/" className="nav-link logout d-none">Sign Out</Link>
          </div>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="navbar-nav-main navbar-light bg-light" navbar>
              {this.props && this.props.data && this.props.data.menus && this.props.data.menus.primary ? (
                this.props.data.menus.primary.map((item, i) => {
                  return (
                    <NavItem key={i}>
                      <NavLink to={item.url} activeClassName="active" exact tag={RRNavLink}>{item.title}</NavLink>
                    </NavItem>
                  );
                })
              ) : (
                data.menus.primary.map((item, i) => {
                  return (
                    <NavItem key={i}>
                      <NavLink to={item.url} activeClassName="active" exact tag={RRNavLink}>{item.title}</NavLink>
                    </NavItem>
                  );
                })
              )}
            </Nav>
            <Nav className="navbar-nav-utility" navbar>
              <NavItem>
                <NavLink><img src={window._env_.PUBLIC_URL + "/images/icons/search.svg"} alt={data.menus.utility.search} className="mr-1" /> {data.menus.utility.search}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink><img src={window._env_.PUBLIC_URL + "/images/icons/map-marker.svg"} alt={data.menus.utility.locations} className="mr-1" /> {data.menus.utility.locations}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink><img src={window._env_.PUBLIC_URL + "/images/icons/cart.svg"} alt={data.menus.utility.cart} className="mr-1" /> {data.menus.utility.support}</NavLink>
              </NavItem>
              <NavItem className="login">
                <NavLink href="#" onClick={this.triggerModalLoginPassword.bind(this)}><img src={window._env_.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.login} className="mr-1" /> {data.menus.utility.login}</NavLink>
              </NavItem>
              <NavItem className="logout d-none">
                <Link to="/" className="nav-link"><img src={window._env_.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.logout}</Link>
              </NavItem>
              <NavItem className="register">
                <NavLink href={window._env_.PUBLIC_URL + "/velocity/register.html"}><img src={window._env_.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.register}</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <ModalRegister ref={this.modalRegister} onSubmit={this.onModalRegisterSubmit.bind(this)} handleFormInput={this.handleFormInput.bind(this)} />
        <ModalRegisterConfirm ref={this.modalRegisterConfirm} />
        {/* <ModalLogin ref="modalLogin" /> */}
        <ModalLoginPassword ref={this.modalLoginPassword} />
      </section>
    );
  }
}

export default NavbarMain;
