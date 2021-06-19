import React from 'react'
import {
  Container, Row, Col, Button, Modal,
  ModalHeader,
  TabContent, TabPane, Badge,
  ModalBody,
  FormGroup,
  CustomInput, Input, Label
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

// Components
import NavbarMain from '../../components/NavbarMain';
import WelcomeBar from '../../components/WelcomeBar';
import FooterMain from '../../components/FooterMain';
import AccountsSubnav from '../../components/AccountsSubnav';
import AccountsDropdown from '../../components/AccountsDropdown';
// import AccountsSectionNav from '../../components/AccountsSectionNav';
import Session from "../../components/Utils/Session"; /* PING INTEGRATION: */
import FlowHandler from "../../components/Controller/FlowHandler"; /* PING INTEGRATION: */

// Data
import data from '../../data/shop/index.json';
import profileData from "../../data/dashboard/settings/profile.json"; /* PING INTEGRATION: */

// Styles
import "../../styles/pages/shop.scss";
import { tsImportEqualsDeclaration } from '@babel/types';

class Shop extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      activeTab: '1',
      isOpenLoading: false,
      isOpenConfirmation: false,
      isOpenCheckoutPrompt: false, /* PING INTEGRATION: */
      isOpenGuestEmailPrompt: false, /* PING INTEGRATION: */
      activeTabConfirmation: '1',
      selectedItem: {
        protection: {},
        mounting: {}
      }
    };
    this.session = new Session(); /* PING INTEGRATION: */
    this.isLoggedOut = true; /* PING INTEGRATION: */ //TODO does this really need to be a class variable???
    this.flowHandler = new FlowHandler(); /* PING INTEGRATION: */
    this.envVars = window._env_; /* PING INTEGRATION: */
  }
  onClosed() {
    this.setState({
      activeTab: '1'
    });
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  addToCart(item) {
    this.setState({
      isOpen: !this.state.isOpen,
      selectedItem: item
    }, () => { this.session.setAuthenticatedUserItem("cart", JSON.stringify(this.state.selectedItem), "local"); });
  }
  toggleLoading() {
    this.setState({
      isOpenLoading: !this.state.isOpenLoading
    });
  }
  toggleConfirmation() {
    this.clearShoppingCart();
    this.setState({
      isOpenConfirmation: !this.state.isOpenConfirmation
    });
  }
  toggleTab(tab) {
    this.setState({
      activeTab: tab
    }, () => {
      console.log("toggletab state", this.state);
    });
  }
  toggleTabConfirmation(tab) {
    this.setState({
      activeTabConfirmation: tab
    });
  }
  onApproval() {
    console.log("cart total", this.state.selectedItem.price);
    let self = this;
    this.toggle();
    let cost = this.state.selectedItem.price;
    cost = cost.replace(/\$|,/gi, "");
    console.log("cost", cost);
    if (parseFloat(cost) >= 1000.00) {
      console.log("need approval");
      this.toggleLoading();
      setTimeout(function () {
        self.toggleLoading();
        self.toggleConfirmation();
      }, 3000);
    } else {
      console.log("no approval");
      self.toggleConfirmation();
    }
  }

  /* BEGIN PING INTEGRATION: */
  clearShoppingCart() {
    this.session.removeAuthenticatedUserItem("cart", "local");
    this.setState({
      selectedItem: {
        protection: {},
        mounting: {}
      },
      isOpen: !this.state.isOpen
    });
  }

  toggleCheckoutPrompt() {
    console.log("toggleCheckoutPrompt clicked");
    this.setState({
      isOpenCheckoutPrompt: !this.state.isOpenCheckoutPrompt
    });
  }
  toggleGuestEmailPrompt() {
    console.log("toggleGuestEmailPrompt clicked");
    this.setState({
      isOpenGuestEmailPrompt: !this.state.isOpenGuestEmailPrompt
    });
  }

  signInToCheckout() {
    this.session.setAuthenticatedUserItem("authMode", "login", "session");
    const redirectURI = this.envVars.REACT_APP_HOST + this.envVars.PUBLIC_URL + "/";
    this.flowHandler.initAuthNFlow({ grantType: "authCode", clientId: this.envVars.REACT_APP_CLIENT, redirectURI: redirectURI, scopes: "openid profile email" });
  }

  guestCheckout() {
    this.toggleGuestEmailPrompt()
  }

  updateProfile() {
    this.setState({ acctVerified: true }, () => {
      //TODO call to flowHandler here. Depending on error handling, maybe call local function that wraps call to flowHandler.
      this.toggleTab("2");
    });
  }

  checkout() {
    if (!this.isLoggedOut) {
      console.log("we're logged in");
      if (this.state.acctVerified) {
        console.log("and acct verified");
        this.onApproval();
      } else {
        //TODO Read user attributes and Display tab 3. User adds/updates profile.
        console.log("but acct not verified");
        this.toggleTab("3");
      }

      // TODO Clicking save of tab 3 updates user.
      // Toggle back to Order summary tab again.
      // TODO check here for cart total. 
      // If aboev threshold toggle the loading modal and do BXF CIBA call.
      // this.toggleLoading();
      //  TODO if approved, toggle loading and confirmation
      // this.toggleLoading();
      // this.toggleConfirmation();
    } else {
      console.log("we're not logged in");
      this.toggle();
      this.toggleCheckoutPrompt();
    }
  }

  componentDidMount() {
    this.isLoggedOut = (this.session.getAuthenticatedUserItem("IdT", "session") === null || this.session.getAuthenticatedUserItem("IdT", "session") === 'undefined') ? true : false;
    const hasCartInStorage = (this.session.getAuthenticatedUserItem("cart", "local") === null || this.session.getAuthenticatedUserItem("cart", "local") === 'undefined') ? false : true;
    if (hasCartInStorage) {
      console.log("We have a cart");
      this.addToCart(JSON.parse(this.session.getAuthenticatedUserItem("cart", "local")));
    }
  }
  /* END PING INTEGRATION: */

  render() {
    const closeBtn = <div />;
    return (
      <div className="dashboard accounts accounts-overview shop">
        <NavbarMain toggleCart={this.toggleTab} />
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
              <div className="text-center mt-4">
                <p><strong>Shop at our Extraordinary Club Partners</strong></p>
              </div>
              <Row className="sites align-items-center">
                <Col><img src={window._env_.PUBLIC_URL + "/images/logo-bxclothes.svg"} alt="BXClothes" /></Col>
                <Col><img src={window._env_.PUBLIC_URL + "/images/logo-bxhome.svg"} alt="BXHome" /></Col>
                <Col><img src={window._env_.PUBLIC_URL + "/images/logo-bxoffice.svg"} alt="BXOffice" /></Col>
                <Col><img src={window._env_.PUBLIC_URL + "/images/logo-bxtech.svg"} alt="BXTech" /></Col>
              </Row>
            </div>
            <div className="content">
              <div className="accounts-hdr">
                <h1>{data.title}</h1>
                <AccountsDropdown text={data.dropdown} />
              </div>
              <div className="module">
                <Row>
                  {data.productsClickable.map((item, i) => {
                    return (
                      <Col md={4} key={i}>
                        <div className="product">
                          {item.featured &&
                            <Badge color="primary">Best Value</Badge>
                          }
                          <img alt='' src={window._env_.PUBLIC_URL + "/images/products/" + item.img} className="img-fluid" />
                          <h5>{item.title}</h5>
                          <img alt='' src={window._env_.PUBLIC_URL + "/images/icons/stars-" + item.stars + ".svg"} />
                          <p className="price">{item.price} <small>{item.tax}</small></p>
                          <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
                          <Button color="primary" onClick={() => this.addToCart(item)}><img alt='' src={window._env_.PUBLIC_URL + "/images/icons/cart.svg"} /> {item.button}</Button>
                        </div>
                      </Col>
                    );
                  })}
                  {data.products.map((item, i) => {
                    return (
                      <Col md={4} key={i}>
                        <div className="product">
                          {item.featured &&
                            <Badge color="primary">Best Value</Badge>
                          }
                          <img alt='' src={window._env_.PUBLIC_URL + "/images/products/" + item.img} className="img-fluid" />
                          <h5>{item.title}</h5>
                          <img alt='' src={window._env_.PUBLIC_URL + "/images/icons/stars-" + item.stars + ".svg"} />
                          <p className="price">{item.price} <small>{item.tax}</small></p>
                          <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
                          <Button color="primary"><img alt='' src={window._env_.PUBLIC_URL + "/images/icons/cart.svg"} /> {item.button}</Button>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
              <img alt='' src={window._env_.PUBLIC_URL + "/images/products/pagination.png"} className="img-fluid mb-3" />
            </div>
          </div>
        </Container>
        <FooterMain />
        {/* Cart */}
        <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} onClosed={this.onClosed.bind(this)} className="modal-xl modal-shop" centered={true}>
          <ModalBody>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col>
                    <h4>
                      <img alt='' src={window._env_.PUBLIC_URL + "/images/icons/check-blue-circle.svg"} className="mx-3" />
                      {data.modal.product.title}
                    </h4>
                  </Col>
                  <Col className="text-right">
                    <div><Button type="button" color="link">{data.modal.product.buttons.cart}</Button></div>
                    <div><Button type="button" color="link" onClick={this.toggle.bind(this)}>{data.modal.product.buttons.continue}</Button></div>
                    <div><Button type="button" color="link" onClick={this.clearShoppingCart.bind(this)}>{data.modal.product.buttons.clearCart}</Button></div>
                  </Col>
                </Row>
                <Row className="p-4 pt-md-0">
                  <Col md={5} className="text-center"><img alt='' src={window._env_.PUBLIC_URL + "/images/products/" + this.state.selectedItem.img} className="img-fluid img-product" /></Col>
                  <Col md={7} className="my-auto">
                    <div className="product">
                      <h5>{this.state.selectedItem.title}</h5>
                      <p>{this.state.selectedItem.model}</p>
                      <img alt='' src={window._env_.PUBLIC_URL + "/images/icons/stars-" + this.state.selectedItem.stars + ".svg"} />
                      <p className="price">{this.state.selectedItem.price} <small>{this.state.selectedItem.tax}</small></p>
                      <div><Button type="button" color="link">{data.modal.product.buttons.details}</Button></div>
                      <div><Button type="button" color="link">{data.modal.product.buttons.calculate}</Button></div>
                    </div>
                  </Col>
                </Row>
                {/* Cart: Protection Section Settings */}
                <Row className="bg-light p-4">
                  <Col md={7}>
                    <h4>{this.state.selectedItem.protection.title}</h4>
                    <p dangerouslySetInnerHTML={{ __html: this.state.selectedItem.protection.content }}></p>
                  </Col>
                  <Col md={5} className="my-auto">
                    <FormGroup className="mt-3">
                      <CustomInput id="protection_options" readOnly type="radio" name="protection_options" checked={this.state.selectedItem.mounting == null} className="mt-2" label={this.state.selectedItem.protection.option1} />
                      <CustomInput id="protection_options" type="radio" name="protection_options" className="mt-2" label={this.state.selectedItem.protection.option2} />
                    </FormGroup>
                    {this.state.selectedItem.mounting == null && (
                      <div className="text-right mt-4" style={{ paddingTop: "70px" }}>
                        <Button type="button" color="link">{data.modal.product.buttons.skip}</Button>
                        <Button type="button" color="primary" className="ml-3" onClick={() => { this.toggleTab('2'); }}>{this.state.selectedItem.servicesButton}</Button>
                      </div>
                    )}
                  </Col>
                </Row>
                {/* Cart: Mounting Section Settings */}
                {this.state.selectedItem.mounting != null && (
                  <Row className="p-4">
                    <Col md={7}>
                      <h4>{this.state.selectedItem.mounting.title}</h4>
                      <p dangerouslySetInnerHTML={{ __html: this.state.selectedItem.mounting.content }}></p>
                      <img alt='' src={window._env_.PUBLIC_URL + "/images/any-tv-partner-photo-services.jpg"} className="img-services" />
                    </Col>
                    <Col md={5} className="my-auto">
                      <FormGroup className="mt-3">
                        <CustomInput readOnly id="mounting_options" type="radio" name="mounting_options" checked label={this.state.selectedItem.mounting.option1} />
                        <a href="#" className="ml-4"><small>{this.state.selectedItem.mounting.included}</small></a>
                        <CustomInput id="mounting_options" type="radio" name="mounting_options" className="mt-2" label={this.state.selectedItem.mounting.option2} />
                        <a href="#" className="ml-4"><small>{this.state.selectedItem.mounting.included}</small></a>
                      </FormGroup>
                      <div className="text-right mt-4">
                        <Button type="button" color="link">{data.modal.product.buttons.skip}</Button>
                        <Button type="button" color="primary" className="ml-3" onClick={() => { this.toggleTab('2'); }}>{this.state.selectedItem.servicesButton}</Button>
                      </div>
                    </Col>
                  </Row>
                )}
              </TabPane>
              {/* Order Summary */}
              <TabPane tabId="2">
                <Row>
                  <Col>
                    <h4 className="pl-4">
                      {data.modal.cart.title}
                    </h4>
                  </Col>
                  <Col className="text-right">
                    <div><Button type="button" color="link" onClick={this.toggle.bind(this)}>{data.modal.product.buttons.continue}</Button></div>
                    <div><Button type="button" color="link" onClick={this.clearShoppingCart.bind(this)}>{data.modal.product.buttons.clearCart}</Button></div>
                  </Col>
                </Row>
                <Row className="p-3">
                  <Col md={4} className="text-center">
                    <img alt='' src={window._env_.PUBLIC_URL + "/images/products/" + this.state.selectedItem.img} className="img-services" />
                  </Col>
                  <Col md={5}>
                    <div className="product">
                      <h5>{this.state.selectedItem.title}</h5>
                      <p>{this.state.selectedItem.model}</p>
                      <img alt='' src={window._env_.PUBLIC_URL + "/images/icons/stars-" + this.state.selectedItem.stars + ".svg"} />
                      <div><Button type="button" color="link">{data.modal.product.buttons.details}</Button></div>
                    </div>
                  </Col>
                  <Col md={1}>
                    <FormGroup>
                      <Input readOnly type="number" value="1" />
                    </FormGroup>
                  </Col>
                  <Col md={1}>
                    <h5>{this.state.selectedItem.price}</h5>
                  </Col>
                </Row>
                <Row className="p-3">
                  {/* Order Summary: Services Section Settings */}
                  {this.state.selectedItem.mounting != null ? (
                    <Col md={4} className="text-center">
                      <img alt='' src={window._env_.PUBLIC_URL + "/images/any-tv-partner-photo-services.jpg"} className="img-services" />
                    </Col>
                  ) : (
                    <Col md={4} className="text-center">
                    </Col>
                  )}
                  {this.state.selectedItem.mounting == null ? (
                    <Col md={5}>
                      <div className="product">
                        <h5>BXRetail Protection Plan</h5>
                        <p>(2 Year)</p>
                        <div><Button type="button" color="link">{this.state.selectedItem.protection.included}</Button></div>
                      </div>
                    </Col>
                  ) : (
                    <Col md={5}>
                      <div className="product">
                        <h5>Delivery + Premium TV Mounting 56" and larger</h5>
                        <p>(Mount, Connect, and Setup included)</p>
                        <div><Button type="button" color="link">{this.state.selectedItem.mounting.included}</Button></div>
                      </div>
                    </Col>
                  )}
                  <Col md={1}>
                    <FormGroup>
                      <Input readOnly type="number" value="1" />
                    </FormGroup>
                  </Col>
                  <Col md={1}>
                    <h5>{this.state.selectedItem.servicesPrice}</h5>
                  </Col>
                </Row>
                <Row className="p-3">
                  <Col md={4}>
                  </Col>
                  <Col md={8}>
                    <hr />
                    <h5 className="mb-4">{data.modal.cart.paymentOptions.title}</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <CustomInput type="radio" name="cart_options" checked label={data.modal.cart.paymentOptions.option1} />
                          <CustomInput type="radio" name="cart_options" className="mt-2" label={data.modal.cart.paymentOptions.option2} />
                          <CustomInput type="radio" name="cart_options" className="mt-2" label={data.modal.cart.paymentOptions.option3} />
                        </FormGroup>
                      </Col>
                      <Col md={3} className="text-right">
                        <p>{data.modal.cart.labels.subtotal}</p>
                        <p className="mt-2">{data.modal.cart.labels.salesTax}</p>
                        <p className="mt-2"><strong>{data.modal.cart.labels.finalTotal}</strong></p>
                      </Col>
                      <Col md={2}>
                        <p>{this.state.selectedItem.subtotal}</p>
                        <p className="mt-2">{this.state.selectedItem.salesTax}</p>
                        <p className="mt-2"><strong>{this.state.selectedItem.finalTotal}</strong></p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {this.state.selectedItem.mounting != null ? (
                  <div className="text-right mt-2 mr-4 mb-4">
                    <Button type="button" color="link">{data.modal.cart.buttons.update}</Button>
                    <Button type="button" color="primary" className="ml-3" onClick={() => { this.checkout(); }}>{data.modal.cart.buttons.checkout}</Button>
                  </div>
                ) : (
                  <div className="text-right mt-2 mr-4 mb-4">
                    <Button type="button" color="link">{data.modal.cart.buttons.update}</Button>
                    <Button type="button" color="primary" className="ml-3" onClick={() => { this.checkout(); }}>{data.modal.cart.buttons.checkout}</Button>
                  </div>
                )}
              </TabPane>
              {/* Profile data confirmation */}
              {/* TODO form fields in this TabPane need to be controlled inputs updating state onChange */}
              <TabPane tabId="3">
                <div className="module">
                  <h2>Confirm or update your account and shipping details</h2>
                  <h3>Profile Details</h3>
                  <Row form>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="firstname">{profileData.form.fields.firstname.label}</Label>
                        <Input type="text" name="firstname" id="firstname" placeholder={profileData.form.fields.firstname.placeholder} value={profileData.form.fields.firstname.value} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="lastname">{profileData.form.fields.lastname.label}</Label>
                        <Input type="text" name="lastname" id="lastname" placeholder={profileData.form.fields.lastname.placeholder} value={profileData.form.fields.lastname.value} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="fullname">{profileData.form.fields.fullname.label}</Label>
                        <Input type="text" name="fullname" id="fullname" placeholder={profileData.form.fields.fullname.placeholder} value={profileData.form.fields.fullname.value} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="email">{profileData.form.fields.email.label}</Label>
                        <Input type="email" name="email" id="email" placeholder={profileData.form.fields.email.placeholder} value={profileData.form.fields.email.value} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="phone">{profileData.form.fields.phone.label}</Label>
                        <Input type="tel" name="phone" id="phone" placeholder={profileData.form.fields.phone.placeholder} value={profileData.form.fields.phone.value} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="birthdate">{profileData.form.fields.birthdate.label}</Label>
                        <Input type="text" name="birthdate" id="birthdate" placeholder={profileData.form.fields.birthdate.placeholder} value={profileData.form.fields.birthdate.value} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="street">{profileData.form.fields.street.label}</Label>
                        <Input type="text" name="street" id="street" placeholder={profileData.form.fields.street.placeholder} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="city">{profileData.form.fields.city.label}</Label>
                        <Input type="text" name="city" id="city" placeholder={profileData.form.fields.city.placeholder} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="zipcode">{profileData.form.fields.zipcode.label}</Label>
                        <Input type="text" name="zipcode" id="zipcode" placeholder={profileData.form.fields.zipcode.placeholder} />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="city">{profileData.form.fields.login.label}</Label>
                        <Input type="select" name="login" id="login">
                          <option value="mobile">{profileData.form.fields.login.options.mobile}</option>
                          <option value="password">{profileData.form.fields.login.options.password}</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col>
                      <div className="text-right">
                        <Button type="button" color="link" className="ml-3">{profileData.form.buttons.cancel}</Button>
                        {/* <Button type="button" color="primary" onClick={this.props.onSubmit}>{profileData.form.buttons.submit}</Button> */}
                        <Button type="button" color="primary" onClick={() => { this.updateProfile() }}>{profileData.form.buttons.submit}</Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </TabContent>
          </ModalBody>
        </Modal>
        {/* PING INTEGRATION: "checkout as guest or sign in" prompt isOpenCheckoutPrompt toggleCheckoutPrompt */}
        <Modal isOpen={this.state.isOpenCheckoutPrompt} toggle={this.toggleCheckoutPrompt.bind(this)} className="modal-login">
          <ModalHeader toggle={this.toggleCheckoutPrompt.bind(this)} close={closeBtn}><img src={window._env_.PUBLIC_URL + "/images/logo.svg"} alt="logo" /></ModalHeader>
          <ModalBody>
            <h4>{data.modal.prompt.title}</h4>
            <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            <Button color="link" onClick={this.signInToCheckout.bind(this)}>{data.modal.prompt.buttons.signin}</Button>
            <Button color="link" onClick={this.guestCheckout.bind(this)}>{data.modal.prompt.buttons.checkout}</Button>
          </ModalBody>
        </Modal>
        {/* PING INTEGRATION: collect email for guest checkout */}
        <Modal isOpen={this.state.isOpenGuestEmailPrompt} toggle={this.toggleGuestEmailPrompt.bind(this)} className="modal-login">
          <ModalHeader toggle={this.toggleGuestEmailPrompt.bind(this)} close={closeBtn}><img src={window._env_.PUBLIC_URL + "/images/logo.svg"} alt="logo" /></ModalHeader>
          <ModalBody>
            <h4>{data.modal.emailPrompt.title}</h4>
            <FormGroup className="form-group-light">
              <Label for="email">{profileData.form.fields.email.label}</Label>
              <Input type="text" name="email" id="email" placeholder={profileData.form.fields.email.placeholder} />
              <div>
                <Button type="button" color="link" size="sm" className="pl-0" onClick={() => { console.log("need to do lookup for existing account") }}>{profileData.form.buttons.submit}</Button>
              </div>
            </FormGroup>
          </ModalBody>
        </Modal>
        {/* Loading */}
        <Modal isOpen={this.state.isOpenLoading} toggle={this.toggleLoading.bind(this)} className="modal-login">
          <ModalHeader toggle={this.toggleLoading.bind(this)} close={closeBtn}><img src={window._env_.PUBLIC_URL + "/images/logo.svg"} alt="logo" /></ModalHeader>
          <ModalBody>
            <div className="mobile-loading" style={{ backgroundImage: `url(${window._env_.PUBLIC_URL}/images/login-device-outline.jpg)` }}>
              <div className="spinner">
                <FontAwesomeIcon icon={faCircleNotch} size="3x" className="fa-spin" />
              </div>
              <p>{data.modal.loading.title}</p>
            </div>
            <div className="mt-4 text-center">
              <Button type="button" color="link" size="sm">{data.modal.loading.help}</Button>
            </div>
          </ModalBody>
        </Modal>
        {/* Confirmation */}
        <Modal isOpen={this.state.isOpenConfirmation} toggle={this.toggleConfirmation.bind(this)} onClosed={this.onClosed.bind(this)} className="modal-xl modal-shop" centered={true}>
          <ModalBody>
            <TabContent activeTab={this.state.activeTabConfirmation}>
              <TabPane tabId="1">
                <Row>
                  <Col md={10}>
                    <h4 className="pl-4">
                      {data.modal.confirmation.title}
                    </h4>
                    <p className="pl-4">{this.state.selectedItem.confirmationSubtitle}</p>
                  </Col>
                  <Col md={2} className="text-right">
                    <div><Button type="button" color="link" onClick={this.toggleConfirmation.bind(this)}>{data.modal.product.buttons.continue}</Button></div>
                  </Col>
                </Row>
                <Row className="p-3">
                  <Col md={4} className="text-center">
                    <img alt='' src={window._env_.PUBLIC_URL + "/images/products/" + this.state.selectedItem.img} className="img-services" />
                  </Col>
                  <Col md={5}>
                    <div className="product">
                      <h5>{this.state.selectedItem.title}</h5>
                      <p>{this.state.selectedItem.model}</p>
                      <img alt='' src={window._env_.PUBLIC_URL + "/images/icons/stars-" + this.state.selectedItem.stars + ".svg"} />
                      <div><Button type="button" color="link">{data.modal.product.buttons.details}</Button></div>
                    </div>
                  </Col>
                  <Col md={1}>
                    <FormGroup>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <h5>{this.state.selectedItem.price}</h5>
                  </Col>
                </Row>
                <Row className="p-3">
                  {/* Order Summary: Services Section Settings */}
                  {this.state.selectedItem.mounting != null ? (
                    <Col md={4} className="text-center">
                      <img alt='' src={window._env_.PUBLIC_URL + "/images/any-tv-partner-photo-services.jpg"} className="img-services" />
                    </Col>
                  ) : (
                    <Col md={4} className="text-center">
                    </Col>
                  )}
                  {this.state.selectedItem.mounting == null ? (
                    <Col md={5}>
                      <div className="product">
                        <h5>BXRetail Protection Plan</h5>
                        <p>(2 Year)</p>
                        <div><Button type="button" color="link">{this.state.selectedItem.protection.included}</Button></div>
                      </div>
                    </Col>
                  ) : (
                    <Col md={5}>
                      <div className="product">
                        <h5>Delivery + Premium TV Mounting 56" and larger</h5>
                        <p>(Mount, Connect, and Setup included)</p>
                        <div><Button type="button" color="link">{this.state.selectedItem.protection.included}</Button></div>
                      </div>
                    </Col>
                  )}
                  <Col md={1}>
                    <FormGroup>
                    </FormGroup>
                  </Col>
                  <Col md={1}>
                    <h5>{this.state.selectedItem.servicesPrice}</h5>
                  </Col>
                </Row>
                <Row className="p-3">
                  <Col md={4}>
                  </Col>
                  <Col md={8}>
                    <hr />
                    <Row>
                      <Col md={9} className="text-right">
                        <p>{data.modal.cart.labels.subtotal}</p>
                        <p className="mt-2">{data.modal.cart.labels.salesTax}</p>
                        <p className="mt-2"><strong>{data.modal.cart.labels.finalTotal}</strong> {data.modal.confirmation.paymentMethod}</p>
                      </Col>
                      <Col md={2}>
                        <p>{this.state.selectedItem.subtotal}</p>
                        <p className="mt-2">{this.state.selectedItem.salesTax}</p>
                        <p className="mt-2"><strong>{this.state.selectedItem.finalTotal}</strong></p>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                  </Col>
                </Row>
                {this.state.selectedItem.mounting !== null && (
                  <Row className="bg-light p-4">
                    <Col md={7}>
                      <h4>{data.modal.confirmation.subtitle}</h4>
                      <p dangerouslySetInnerHTML={{ __html: data.modal.confirmation.scheduleDescription }}></p>
                    </Col>
                    <Col md={5}>
                      <div className="text-right mt-4" style={{ paddingTop: "70px" }}>
                        <Button type="button" color="link">{data.modal.confirmation.scheduleButtons.call}</Button>
                        <Button type="button" color="primary" className="ml-3" onClick={() => { this.toggleTabConfirmation('2'); }}>{data.modal.confirmation.scheduleButtons.online}</Button>
                      </div>
                    </Col>
                  </Row>
                )}
              </TabPane>
              <TabPane tabId="2">
                <p className="text-center mt-4">
                  <img src={window._env_.PUBLIC_URL + "/images/logo.svg"} alt="logo" />
                </p>
                <Row className="p-3">
                  <Col md={4} className="text-center">
                    <img alt='' src={window._env_.PUBLIC_URL + "/images/any-tv-partner-photo-services.jpg"} className="img-services mb-4" />
                  </Col>
                  <Col md={8} className="radio-form">
                    <div className="product mb-4">
                      <p>{data.modal.confirmation.consents.description1}</p>
                      <p>{data.modal.confirmation.consents.description2}</p>
                      <p>{data.modal.confirmation.consents.description3}</p>
                    </div>
                    <h5 className="mb-4">{data.modal.confirmation.consents.iAgree}</h5>
                    {/* If you're getting delivery/installation, not sharing address doesn't make sense.
                    <FormGroup>
                      <Label>My Ship To/Installation Address</Label>
                      <CustomInput type="radio" name="address" label="Yes" />
                      <CustomInput type="radio" name="address" checked label="No" />
                    </FormGroup>
                    */}
                    <FormGroup>
                      <Label>{data.modal.confirmation.consents.phoneLabel}</Label>
                      <CustomInput type="radio" name="phone" label="Yes" />
                      <CustomInput type="radio" name="phone" checked label="No" />
                    </FormGroup>
                    <FormGroup>
                      <Label>{data.modal.confirmation.consents.emailLabel}</Label>
                      <CustomInput type="radio" name="email" label="Yes" />
                      <CustomInput type="radio" name="email" checked label="No" />
                    </FormGroup>
                  </Col>
                </Row>
                <div className="text-right mt-2 mr-4 mb-4">
                  <Button type="button" color="link" onClick={() => { this.toggleTabConfirmation('1'); }}>{data.modal.confirmation.consentButtons.cancel}</Button>
                  <Button type="button" color="primary" className="ml-3" onClick={() => { this.toggleTabConfirmation('3'); }}>{data.modal.confirmation.consentButtons.save}</Button>
                </div>
              </TabPane>
              <TabPane tabId="3">
                <p className="text-center mt-4">
                  <img src={window._env_.PUBLIC_URL + "/images/logo.svg"} alt="logo" />
                </p>
                <div className="radio-form p-5">
                  <div className="product mb-4">
                    <p>{data.modal.confirmation.consents.confirmation}</p>
                  </div>
                  {/*
                  <FormGroup>
                    <Label>My Ship To/Installation Address</Label>
                    <CustomInput type="radio" name="address2" label="Yes" />
                    <CustomInput type="radio" name="address2" checked label="No" />
                  </FormGroup>
                  */}
                  <FormGroup>
                    <Label>{data.modal.confirmation.consents.phoneLabel}</Label>
                    <CustomInput type="radio" name="phone2" label="Yes" />
                    <CustomInput type="radio" name="phone2" checked label="No" />
                  </FormGroup>
                  <FormGroup>
                    <Label>{data.modal.confirmation.consents.emailLabel}</Label>
                    <CustomInput type="radio" name="email2" label="Yes" />
                    <CustomInput type="radio" name="email2" checked label="No" />
                  </FormGroup>
                  <div className="text-right mt-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTabConfirmation('2'); }}>{data.modal.confirmation.consentButtons.changeSettings}</Button>
                  </div>
                </div>
                <a alt='Confirmation Footer' href="/any-tv-partner"><img src={window._env_.PUBLIC_URL + "/images/shop-confirmation-footer-2.png"} className="confirmation-footer" /></a>
              </TabPane>
            </TabContent>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default Shop
