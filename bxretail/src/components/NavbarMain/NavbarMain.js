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
import ModalLogin from '../ModalLogin';

// Styles
import './NavbarMain.scss';

// Data
import data from './data.json';

class NavbarMain extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }
  triggerModalRegister() {
    this.refs.modalRegister.toggle();
  }
  onModalRegisterSubmit() {
    this.refs.modalRegister.toggle();
    this.refs.modalRegisterConfirm.toggle();
  }
  triggerModalRegisterConfirm() {
    this.refs.modalRegisterConfirm.toggle();
  }
  triggerModalLogin() {
    this.refs.modalLogin.toggle();
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  componentDidMount () {
    if ( window.location.search ) {
      this.refs.modalRegisterConfirm.toggle();
    }
  }
  render() {
    return (
      <section className="navbar-main">
        {/* DESKTOP NAV */}
        <Navbar color="dark" dark expand="md" className="navbar-desktop">
          <Container>
            <Link to="/" className="navbar-brand"><img src={process.env.PUBLIC_URL + "/images/logo-white.svg"} alt={data.brand} /></Link>
            <NavbarToggler onClick={this.toggle.bind(this)} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="justify-content-end ml-auto navbar-nav-utility" navbar>
                <NavItem>
                  <NavLink><img src={process.env.PUBLIC_URL + "/images/navbar-search.png"} alt={data.menus.utility.search} className="searchbar" /></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/map-marker.svg"} alt={data.menus.utility.locations} /></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/cart.svg"} alt={data.menus.utility.cart} /></NavLink>
                </NavItem>
                <NavItem className="login">
                  <NavLink href="#" onClick={this.triggerModalLogin.bind(this)}><img src={process.env.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.login} className="mr-1" /> {data.menus.utility.login}</NavLink>
                </NavItem>
                <NavItem className="logout d-none">
                  <Link to="/" className="nav-link"><img src={process.env.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.logout}</Link>
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
              { this.props && this.props.data && this.props.data.menus && this.props.data.menus.primary ? (
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
            <Link to="/" className="navbar-brand"><img src={process.env.PUBLIC_URL + "/images/logo-white.svg"} alt={data.brand} /></Link>
          </div>
          <div className="mobilenav-login">
            <NavLink href="#" className="login" onClick={this.triggerModalLogin.bind(this)}>Sign In</NavLink>
            <Link to="/" className="nav-link logout d-none">Sign Out</Link>
          </div>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="navbar-nav-main navbar-light bg-light" navbar>
              { this.props && this.props.data && this.props.data.menus && this.props.data.menus.primary ? (
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
                <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/search.svg"} alt={data.menus.utility.search} className="mr-1" /> {data.menus.utility.search}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/map-marker.svg"} alt={data.menus.utility.locations} className="mr-1" /> {data.menus.utility.locations}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/cart.svg"} alt={data.menus.utility.cart} className="mr-1" /> {data.menus.utility.support}</NavLink>
              </NavItem>
              <NavItem className="login">
                <NavLink href="#" onClick={this.triggerModalLogin.bind(this)}><img src={process.env.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.login} className="mr-1" /> {data.menus.utility.login}</NavLink>
              </NavItem>
              <NavItem className="logout d-none">
                <Link to="/" className="nav-link"><img src={process.env.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.logout}</Link>
              </NavItem>
              <NavItem className="register">
                <NavLink href={process.env.PUBLIC_URL + "/velocity/register.html"}><img src={process.env.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.register}</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <ModalRegister ref="modalRegister" onSubmit={this.onModalRegisterSubmit.bind(this)} />
        <ModalRegisterConfirm ref="modalRegisterConfirm" />
        <ModalLogin ref="modalLogin" />
      </section>
    );
  }
}

export default NavbarMain;
