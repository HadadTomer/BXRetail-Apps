// Packages
import React from 'react';
import {
  Button, Jumbotron, Row, Col,
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Media,
  FormGroup,
  Form,
  Label,
  Input
} from 'reactstrap';
import { Link, NavLink as RRNavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

// Components
import WelcomeBar from '../components/WelcomeBar/';

// Data
import data from '../data/any-tv-partner.json';

// Styles
import '../styles/pages/any-tv-partner.scss';

class AnyTVPartner extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      step: 1,
    };

    this.showStep2 = this.showStep2.bind(this);
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  showStep2() {
    this.setState({
      step: 2
    });
  }
  render() {
    return (
      <div className="any-tv-partner">
        <section className="navbar-atp">
          {/* DESKTOP NAV */}
          <Navbar color="light" light expand="md" className="navbar-desktop">
            <Container>
              <Link to="/" className="navbar-brand"><img src={process.env.PUBLIC_URL + "/images/any-tv-partner-logo.svg"} alt={data.brand} /></Link>
              <NavbarToggler onClick={this.toggle.bind(this)} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="justify-content-end ml-auto navbar-nav-utility" navbar>
                  <NavItem>
                    <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/search.svg"} alt={data.menus.utility.search} /></NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/map-marker.svg"} alt={data.menus.utility.locations} /></NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/support.svg"} alt={data.menus.utility.support} /></NavLink>
                  </NavItem>
                  <NavItem className="logout">
                    <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.logout}</NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
          <Navbar color="light" light expand="md" className="navbar-desktop">
            <Container>
              <Nav className="mr-auto navbar-nav-main" navbar>
                {data.menus.primary.map((item, i) => {
                  return (
                    <NavItem key={i}>
                      <NavLink to={item.url} activeClassName="active" exact tag={RRNavLink}>{item.title}</NavLink>
                    </NavItem>
                  );
                })}
              </Nav>
            </Container>
          </Navbar>
          {/* MOBILE NAV */}
          <Navbar color="light" light expand="md" className="navbar-mobile">
            <div className="mobilenav-menu">
              <NavbarToggler onClick={this.toggle.bind(this)} />
            </div>
            <div className="mobilenav-brand">
              <Link to="/" className="navbar-brand"><img src={process.env.PUBLIC_URL + "/images/any-tv-partner-logo.svg"} alt={data.brand} /></Link>
            </div>
            <div className="mobilenav-login">
              <Link to="/" className="nav-link logout">Sign Out</Link>
            </div>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="navbar-nav-main navbar-light bg-light" navbar>
                {data.menus.primary.map((item, i) => {
                  return (
                    <NavItem key={i}>
                      <NavLink to={item.url} activeClassName="active" exact tag={RRNavLink}>{item.title}</NavLink>
                    </NavItem>
                  );
                })}
              </Nav>
              <Nav className="navbar-nav-utility" navbar>
                <NavItem>
                  <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/search.svg"} alt={data.menus.utility.search} className="mr-1" /> {data.menus.utility.search}</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/map-marker.svg"} alt={data.menus.utility.locations} className="mr-1" /> {data.menus.utility.locations}</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/support.svg"} alt={data.menus.utility.support} className="mr-1" /> {data.menus.utility.support}</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink><img src={process.env.PUBLIC_URL + "/images/icons/user.svg"} alt={data.menus.utility.logout} className="mr-1" /> {data.menus.utility.logout}</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </section>
        <WelcomeBar title={data.welcome} />
        <section className="section-content">
          <Container>
            <Row>
              <Col lg="3" className="col-summary">
                <p dangerouslySetInnerHTML={{__html: data.installation.summary.description}}></p>
                <h5>{data.installation.summary.shipping.title}</h5>
                <p dangerouslySetInnerHTML={{__html: data.installation.summary.shipping.content}}></p>
                <a href="/dashboard/settings/privacy-security" className="btn btn-link">{data.installation.summary.shipping.button}</a>
                <h5>{data.installation.summary.contact.title}</h5>
                <p dangerouslySetInnerHTML={{__html: data.installation.summary.contact.content}}></p>
                <a href="/dashboard/settings/privacy-security" className="btn btn-link">{data.installation.summary.contact.button}</a>
              </Col>
              <Col lg="9">
                { this.state.step == 1 &&
                  <div>
                    <h4>{data.installation.step_1.title}</h4>
                    <Row className="row-services">
                      <Col lg="3">
                        <img src={process.env.PUBLIC_URL + "/images/any-tv-partner-photo-services.jpg"} alt="Services" className="img-fluid" />
                      </Col>
                      <Col lg="9">
                        <div dangerouslySetInnerHTML={{__html: data.installation.step_1.services}}></div>
                      </Col>
                    </Row>
                    <Row className="row-services">
                      <Col lg="3">
                        <img src={process.env.PUBLIC_URL + "/images/any-tv-partner-photo-products.jpg"} alt="Products" className="img-fluid" />
                      </Col>
                      <Col lg="9">
                        <div dangerouslySetInnerHTML={{__html: data.installation.step_1.products}}></div>
                      </Col>
                    </Row>
                    <Row className="row-form bg-light">
                      <Col lg="4">
                        <h5>{data.installation.step_1.form.title}</h5>
                        <p dangerouslySetInnerHTML={{__html: data.installation.step_1.form.content}}></p>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <Label for="date">{data.installation.step_1.form.date_label}</Label>
                          <Input type="date" name="date" id="date" value={data.installation.step_1.form.date_value} />
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <Button color="primary" onClick={ this.showStep2 }>{data.installation.step_1.form.button}</Button>
                      </Col>
                    </Row>
                  </div>
                }
                { this.state.step == 2 &&
                  <div>
                    <h4>{data.installation.step_2.title}</h4>
                    <Row className="row-services">
                      <Col lg="3">
                        <img src={process.env.PUBLIC_URL + "/images/any-tv-partner-photo-services.jpg"} alt="Services" className="img-fluid" />
                      </Col>
                      <Col lg="9">
                        <div dangerouslySetInnerHTML={{__html: data.installation.step_2.services}}></div>
                      </Col>
                    </Row>
                    <Row className="row-services">
                      <Col lg="3">
                        <img src={process.env.PUBLIC_URL + "/images/any-tv-partner-photo-products.jpg"} alt="Products" className="img-fluid" />
                      </Col>
                      <Col lg="9">
                        <div dangerouslySetInnerHTML={{__html: data.installation.step_2.products}}></div>
                      </Col>
                    </Row>
                    <Row className="row-form bg-light">
                      <Col lg="4">
                        <h5>{data.installation.step_2.form.title}</h5>
                        <p dangerouslySetInnerHTML={{__html: data.installation.step_2.form.content}}></p>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <Label for="date">{data.installation.step_2.form.date_label}</Label>
                          <Input type="date" name="date" id="date" value={data.installation.step_2.form.date_value} />
                        </FormGroup>
                        <a href="#">{data.installation.step_2.form.date_link}</a>
                      </Col>
                      <Col lg="3">
                        <Button color="primary">{data.installation.step_2.form.button}</Button>
                      </Col>
                    </Row>
                  </div>
                }
              </Col>
            </Row>
          </Container>
        </section>
        <footer className="footer-atp">
          <Container>
            <Row>
              <Col md="6" lg="4" xl="6" className="order-2 order-md-1">
                <Nav className="nav-social">
                  <NavItem>
                    <NavLink href="#"><FontAwesomeIcon icon={faLinkedinIn} size="2x" /></NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#"><FontAwesomeIcon icon={faFacebookF} size="2x" /></NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#"><FontAwesomeIcon icon={faTwitter} size="2x" /></NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#"><FontAwesomeIcon icon={faInstagram} size="2x" /></NavLink>
                  </NavItem>
                </Nav>
                <p dangerouslySetInnerHTML={{__html: data.copyright}}></p>
              </Col>
              <Col md="6" lg="8" xl="6" className="order-1 order-md-2">
                <Nav className="nav-main">
                  {data.menus.footer.map((item, i) => {
                    return (
                      <NavItem className="nav-item-parent" key={i}>
                        <NavLink href={item.url}>{item.title}</NavLink>
                        <Nav vertical>
                          {item.children.map((item, i) => {
                            return (
                              <NavItem key={i}>
                                <NavLink href={item.url}>{item.title}</NavLink>
                              </NavItem>
                            );
                          })}
                        </Nav>
                      </NavItem>
                    );
                  })}
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    );
  }
}

export default AnyTVPartner;
