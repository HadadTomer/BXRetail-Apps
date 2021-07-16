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
import { Link, NavLink as RRNavLink, withRouter } from 'react-router-dom';

// Components
import { asyncInitSecuredTouch } from "./STInitialization";
import ModalRegister from '../ModalRegister';
import ModalRegisterConfirm from '../ModalRegisterConfirm';
// import ModalLogin from '../ModalLogin';
import ModalLoginPassword from '../ModalLoginPassword';
import Session from '../Utils/Session'; /* PING INTEGRATION: */
import FlowHandler from '../Controller/FlowHandler'; /* PING INTEGRATION: */
import ModalMessage from "../ModalMessage";

// Styles
import './NavbarMain.scss';

// Data
import data from './data.json';
// import { faRegistered } from '@fortawesome/free-regular-svg-icons';

class NavbarMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      email: "",            /* PING INTEGRATION: */
      password: "",         /* PING INTEGRATION: */
      password_confirm: "", /* PING INTEGRATION: */
      /*login: "",             PING INTEGRATION: */
      flowId: "",            /* PING INTEGRATION: */
      regCode: "",           /* PING INTEGRATION: */
      isLoggedOut: true       /* PING INTEGRATION: */
    };

    this.session = new Session(); /* PING INTEGRATION: */
    this.envVars = window._env_; /* PING INTEGRATION: */
    this.flowHandler = new FlowHandler(); /* PING INTEGRATION: */
    this.modalRegister = React.createRef();
    this.modalRegisterConfirm = React.createRef();
    this.modalLoginPassword = React.createRef();
    this.toggleCart = this.props.toggleCart;
  }

  triggerModalRegister() {
    this.session.setAuthenticatedUserItem("authMode", "registration", "session");
    const redirectURI = this.envVars.REACT_APP_HOST + this.envVars.PUBLIC_URL + "/";
    //TODO should we move envVars param to controller like get token. Consistent pattern for things UI shouldn't know or care about?
    this.flowHandler.initAuthNFlow({ grantType: "authCode", clientId: this.envVars.REACT_APP_CLIENT, redirectURI: redirectURI, scopes: "openid profile email" });
    // this.modalRegister.current.toggle(); //Moved to componentDidMount because we have to send them to P1 first.
  }
  // Sent as callback to ModalRegister.js
  onModalRegisterSubmit() {
    this.flowHandler.registerUser({ regData: this.state })
      .then(status => {
        if (status === "VERIFICATION_CODE_REQUIRED") { //TODO need to handle status UNIQUENESS_VIOLATION, CONSTRAINT_VIOLATOIN, 
          // this.modalLoginPassword.current.toggle("7");
          this.modalRegister.current.toggle();
          this.modalRegister.current.toggleTab("2");
        } else {
          console.log("Reg status", status);
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
    this.session.setAuthenticatedUserItem("authMode", "login", "session");
    const redirectURI = this.envVars.REACT_APP_HOST + this.envVars.PUBLIC_URL + "/";
    this.flowHandler.initAuthNFlow({ grantType: "authCode", clientId: this.envVars.REACT_APP_CLIENT, redirectURI: redirectURI, scopes: "openid profile email" });
    // this.modalLoginPassword.current.toggle();
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  /* BEGIN PING INTEGRATION: */
  logout() {
    //TODO add ModalError here to display "logging you out" message.

    this.flowHandler.getUserSessions({AT: this.session.getAuthenticatedUserItem("AT", "session")})
    .then(sessionId => {
      this.flowHandler.deleteUserSession({ AT: this.session.getAuthenticatedUserItem("AT", "session"), sessionId: sessionId})
      .then(deleteStatus => {
        if (deleteStatus === 204) {
          this.session.clearUserAppSession("session");
          this.session.deleteCookie({ name: "ST", domain: ".demo-bxretail-auth-qa.ping-devops.com"}); //TODO this needs to be dynamically set.
          this.props.history.push("/");
        } //TODO need error modal here. but also need to get back error data from controller and integration.
      });
    });
  }
  handleFormInput(e) {
    //Update state based on the input's Id and value.
    let formData = {};
    formData[e.target.id] = e.target.value;
    this.setState(formData, () => {
    });
  }
  showCart(myProps) {
    if (window.location.pathname === "/app/shop") {
      console.log("were already on shopping page");
      this.toggleCart("2");
    } else {
      myProps.history.push("shop");
    }
  }
  componentDidMount() {
    const isLoggedOut = (this.session.getAuthenticatedUserItem("IdT", "session") === null || this.session.getAuthenticatedUserItem("IdT", "session") === 'undefined') ? true : false;
    this.setState({ isLoggedOut: isLoggedOut }, () => {
      console.log("isLoggedOut state", this.state.isLoggedOut);
    });
    this.session.protectPage(isLoggedOut, window.location.pathname, this.session.getAuthenticatedUserItem("bxRetailUserType", "session"));

    asyncInitSecuredTouch();

    if (window.location.search) {
      const redirectURI = this.envVars.REACT_APP_HOST + this.envVars.PUBLIC_URL + "/";
      const queryParams = new URLSearchParams(window.location.search);
      const flowId = queryParams.get("flowId");
      const authCode = queryParams.get("code");
      const issuer = queryParams.get("iss");
      this.setState({ flowId: flowId }, () => {
      });

      const authNParam = (flowId) ? "flowId" : (authCode) ? "authCode" : "issuer";
      switch (authNParam) {
        case "flowId":
          if (this.session.getAuthenticatedUserItem("authMode", "session") === "login") {
            this.modalLoginPassword.current.toggle();
          } else {
            this.modalRegister.current.toggle();
          }
        break;
        case "authCode":
          let authPath;
          if (this.session.getAuthenticatedUserItem("authMode", "session") === "ATVP") { authPath = this.envVars.REACT_APP_ATVPAUTHPATH}
          this.flowHandler.swapCodeForToken({ code: authCode, redirectURI: redirectURI, authPath: authPath })
            .then(response => {
              this.session.setAuthenticatedUserItem("AT", response.access_token, "session");
              this.session.setAuthenticatedUserItem("IdT", response.id_token, "session");
              const fullName = this.flowHandler.getTokenValue({ token: response.id_token, key: "fullName" });
              if (fullName) {
                this.session.setAuthenticatedUserItem("fullName", fullName, "session");
              }
              const email = this.flowHandler.getTokenValue({ token: response.id_token, key: "email" });
              const groups = this.flowHandler.getTokenValue({ token: response.id_token, key: "bxRetailUserType" });
              const userType = (groups) ? groups[0] : "Customer";

              this.session.setAuthenticatedUserItem("email", email, "session");
              this.session.setAuthenticatedUserItem("bxRetailUserType", userType, "session");
              if (userType === "AnyTVPartner") {
                this.props.history.push("partner");
              } else if (userType === "AnyMarketing") {
                this.props.history.push("any-marketing");
              } else {
                // Then it's a customer.
                this.props.history.push("shop");
              }
            });
        break;
        case "issuer":
          //TODO this needs to be refactored (remove authPath arg) when flowHandler constructor is refactored. See FIX ME tag in flowhandler.
          this.session.setAuthenticatedUserItem("authMode", "ATVP", "session");
          this.flowHandler.initAuthNFlow({ grantType: "authCode", clientId: this.envVars.REACT_APP_ATVP_CLIENT, redirectURI: redirectURI, scopes: "openid profile email", authPath: this.envVars.REACT_APP_ATVPAUTHPATH });
        break;
        default:
          throw new Error("Unexpected authNParam in componentDidMount()");
      }
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
                  <NavLink onClick={() => { this.showCart(this.props) }}><img src={window._env_.PUBLIC_URL + "/images/icons/cart.svg"} alt={data.menus.utility.cart} /></NavLink>
                </NavItem>
                {this.state.isLoggedOut &&
                  <NavItem className="">
                    <NavLink href="#" onClick={this.triggerModalLoginPassword.bind(this)}><img src={window._env_.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.login} className="mr-1" /> {data.menus.utility.login}</NavLink>
                  </NavItem>}
                {!this.state.isLoggedOut &&
                  <NavItem className="">
                    <NavLink href="#" onClick={this.logout.bind(this)}><img src={window._env_.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.logout}</NavLink>
                  </NavItem>}
                {/* <NavItem className="logout">
                  <Link to="/" className="nav-link"><img src={window._env_.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.logout}</Link>
                </NavItem> */}
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
        <ModalRegister ref={this.modalRegister} onSubmit={this.onModalRegisterSubmit.bind(this)} handleFormInput={this.handleFormInput.bind(this)} flowId={this.state.flowId} />
        <ModalRegisterConfirm ref={this.modalRegisterConfirm} />
        {/* <ModalLogin ref="modalLogin" /> */}
        <ModalLoginPassword ref={this.modalLoginPassword} flowId={this.state.flowId} />
      </section>
    );
  }
}

export default withRouter(NavbarMain);