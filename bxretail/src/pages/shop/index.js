import React from 'react'
import { Container, Row, Col, Button, Modal,
  ModalHeader,
  TabContent, TabPane, Badge,
  ModalBody,
  FormGroup,
  CustomInput, Input, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

// Components
import NavbarMain from '../../components/NavbarMain';
import WelcomeBar from '../../components/WelcomeBar';
import FooterMain from '../../components/FooterMain';
import AccountsSubnav from '../../components/AccountsSubnav';
import AccountsDropdown from '../../components/AccountsDropdown';
// import AccountsSectionNav from '../../components/AccountsSectionNav';

// Data
import data from '../../data/shop/index.json';
 
// Styles
import "../../styles/pages/shop.scss";

class Shop extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      activeTab: '1',
      isOpenLoading: false,
      isOpenConfirmation: false,
      activeTabConfirmation: '1',
      selectedItem: {
        protection: {},
        mounting: {}
      }
    };
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
    });
  }
  toggleLoading() {
    this.setState({
      isOpenLoading: !this.state.isOpenLoading
    });
  }
  toggleConfirmation() {
    this.setState({
      isOpenConfirmation: !this.state.isOpenConfirmation
    });
  }
  toggleTab(tab) {
    this.setState({
      activeTab: tab
    });
  }
  toggleTabConfirmation(tab) {
    this.setState({
      activeTabConfirmation: tab
    });
  }
  onApproval() {
    let self = this;
    this.toggle();
    this.toggleLoading();
    setTimeout(function() {
      self.toggleLoading();
      self.toggleConfirmation();
    }, 3000);
  }
  render() {
    const closeBtn = <div />;
    return(
      <div className="dashboard accounts accounts-overview shop">
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
              <div className="text-center mt-4">
                <p><strong>Shop at our Extraordinary Club Partners</strong></p>
              </div>
              <Row className="sites align-items-center">
                <Col><img src={window._env_.PUBLIC_URL + "/images/logo-bxclothes.svg"} alt="BXClothes" /></Col>
                <Col><img src={window._env_.PUBLIC_URL + "/images/logo-bxhome.svg"} alt="BXClothes" /></Col>
                <Col><img src={window._env_.PUBLIC_URL + "/images/logo-bxoffice.svg"} alt="BXClothes" /></Col>
                <Col><img src={window._env_.PUBLIC_URL + "/images/logo-bxtech.svg"} alt="BXClothes" /></Col>
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
                          <img alt='' src={window._env_.PUBLIC_URL + "/images/products/" + item.img } className="img-fluid" />
                          <h5>{item.title}</h5>
                          <img alt='' src={window._env_.PUBLIC_URL + "/images/icons/stars-" + item.stars + ".svg"} />
                          <p className="price">{item.price} <small>{item.tax}</small></p>
                          <p dangerouslySetInnerHTML={{__html: item.content}}></p>
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
                          <img alt='' src={window._env_.PUBLIC_URL + "/images/products/" + item.img } className="img-fluid" />
                          <h5>{item.title}</h5>
                          <img alt='' src={window._env_.PUBLIC_URL + "/images/icons/stars-" + item.stars + ".svg"} />
                          <p className="price">{item.price} <small>{item.tax}</small></p>
                          <p dangerouslySetInnerHTML={{__html: item.content}}></p>
                          <Button color="primary"><img alt='' src={window._env_.PUBLIC_URL + "/images/icons/cart.svg"} /> {item.button}</Button>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
              <img alt='' src={window._env_.PUBLIC_URL + "/images/products/pagination.png" } className="img-fluid mb-3" />
            </div>
          </div>
        </Container>
        <FooterMain />
        {/* Cart */}
        <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} onClosed={this.onClosed.bind(this)} className="modal-xl modal-shop" centered="true">
          <ModalBody>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col>
                    <h4>
                      <img alt='' src={window._env_.PUBLIC_URL + "/images/icons/check-blue-circle.svg" } className="mx-3" />
                      {data.modal.product.title}
                    </h4>
                  </Col>
                  <Col className="text-right">
                    <div><Button type="button" color="link">{data.modal.product.buttons.cart}</Button></div>
                    <div><Button type="button" color="link" onClick={this.toggle.bind(this)}>{data.modal.product.buttons.continue}</Button></div>
                  </Col>
                </Row>
                <Row className="p-4 pt-md-0">
                  <Col md={5} className="text-center"><img alt='' src={window._env_.PUBLIC_URL + "/images/products/" + this.state.selectedItem.img } className="img-fluid img-product" /></Col>
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
                    <p dangerouslySetInnerHTML={{__html: this.state.selectedItem.protection.content}}></p>
                  </Col>
                  <Col md={5} className="my-auto">
                    <FormGroup className="mt-3">
                      <CustomInput type="radio" name="protection_options" checked={this.state.selectedItem.mounting == null} className= "mt-2" label={this.state.selectedItem.protection.option1} />
                      <CustomInput type="radio" name="protection_options" className="mt-2" label={this.state.selectedItem.protection.option2} />
                    </FormGroup>
                    {this.state.selectedItem.mounting == null && (
                      <div className="text-right mt-4">
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
                    <p dangerouslySetInnerHTML={{__html: this.state.selectedItem.mounting.content}}></p>
                    <img alt='' src={window._env_.PUBLIC_URL + "/images/any-tv-partner-photo-services.jpg"} className="img-services" />
                  </Col>
                  <Col md={5} className="my-auto">
                    <FormGroup className="mt-3">
                      <CustomInput type="radio" name="mounting_options" checked label={this.state.selectedItem.mounting.option1} />
                      <a href="#" className="ml-4"><small>{this.state.selectedItem.mounting.included}</small></a>
                      <CustomInput type="radio" name="mounting_options" className="mt-2" label={this.state.selectedItem.mounting.option2} />
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
                      <Input type="number" value="1" />
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
                        <div><Button type="button" color="link">What's Included?</Button></div>
                      </div>
                    </Col>
                    ) : (
                    <Col md={5}>
                      <div className="product">
                        <h5>Delivery + Premium TV Mounting 56" and larger</h5>
                        <p>(Mount, Connect, and Setup included)</p>
                        <div><Button type="button" color="link">What's Included?</Button></div>
                      </div>
                    </Col>
                  )}
                  <Col md={1}>
                    <FormGroup>
                      <Input type="number" value="1" />
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
                    <h5 className="mb-4">Pay With</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <CustomInput type="radio" name="cart_options" checked label="BXRetail Visa Card (...4899) " />
                          <CustomInput type="radio" name="cart_options" className="mt-2" label="PayPal" />
                          <CustomInput type="radio" name="cart_options" className="mt-2" label="Another Payment Method (Choose)" />
                        </FormGroup>
                      </Col>
                      <Col md={3} className="text-right">
                        <p>Subtotal</p>
                        <p className="mt-2">Sales Tax (MO)</p>
                        <p className="mt-2"><strong>Final Total</strong></p>
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
                    <Button type="button" color="primary" className="ml-3" onClick={() => { this.onApproval(); }}>{data.modal.cart.buttons.checkout}</Button>
                  </div>
                ): (
                  <div className="text-right mt-2 mr-4 mb-4">
                  <Button type="button" color="link">{data.modal.cart.buttons.update}</Button>
                  <Button type="button" color="primary" className="ml-3" onClick={() => { this.toggleConfirmation(); }}>{data.modal.cart.buttons.checkout}</Button>
                </div>
                )}
              </TabPane>
            </TabContent>
          </ModalBody>
        </Modal>
        {/* Loading */}
        <Modal isOpen={this.state.isOpenLoading} toggle={this.toggleLoading.bind(this)} className="modal-login">
          <ModalHeader toggle={this.toggleLoading.bind(this)} close={closeBtn}><img src={window._env_.PUBLIC_URL + "/images/logo.svg"} alt="logo" /></ModalHeader>
          <ModalBody>
            <div className="mobile-loading" style={{backgroundImage: `url(${window._env_.PUBLIC_URL}/images/login-device-outline.jpg)`}}>
              <div className="spinner">
                <FontAwesomeIcon icon={faCircleNotch} size="3x" className="fa-spin" />
              </div>
              <p>Please check your trusted mobile device to approve this transaction.</p>
            </div>
            <div className="mt-4 text-center">
              <Button type="button" color="link" size="sm">What is this?</Button>
            </div>
          </ModalBody>
        </Modal>
        {/* Confirmation */}
        <Modal isOpen={this.state.isOpenConfirmation} toggle={this.toggleConfirmation.bind(this)} onClosed={this.onClosed.bind(this)} className="modal-xl modal-shop" centered="true">
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
                    <div><Button type="button" color="link" onClick={this.toggle.bind(this)}>{data.modal.product.buttons.continue}</Button></div>
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
                        <div><Button type="button" color="link">What's Included?</Button></div>
                      </div>
                    </Col>
                    ) : (
                    <Col md={5}>
                      <div className="product">
                        <h5>Delivery + Premium TV Mounting 56" and larger</h5>
                        <p>(Mount, Connect, and Setup included)</p>
                        <div><Button type="button" color="link">What's Included?</Button></div>
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
                        <p>Subtotal</p>
                        <p className="mt-2">Sales Tax (MO)</p>
                        <p className="mt-2"><strong>Final Total</strong> (Charged to BXRetail Visa ...4884)</p>
                      </Col>
                      <Col md={2}>
                        <p>{this.state.selectedItem.subtotal}</p>
                        <p className="mt-2">{this.state.selectedItem.salesTax}</p>
                        <p className="mt-2"><strong>{this.state.selectedItem.finalTotal}</strong></p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <img alt='' src={window._env_.PUBLIC_URL + "/images/shop-confirmation-footer.png"} className="confirmation-footer" onClick={() => { this.toggleTabConfirmation('2'); }} />
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
                      <p>BXRetail partners with AnyTVPartner for Professional Services installations like yours.</p>
                      <p>To begin scheduling your appointment, we need you to approve sharing of your contact info with AnyTVPartner, so they can work directly with you.</p>
                      <p>Please review these settings below.</p>
                    </div>
                    <h5 className="mb-4">I consent to BXRetail sharing with AnyTVPartner:</h5>
                    {/* If you're getting delivery/installation, not sharing address doesn't make sense.
                    <FormGroup>
                      <Label>My Ship To/Installation Address</Label>
                      <CustomInput type="radio" name="address" label="Yes" />
                      <CustomInput type="radio" name="address" checked label="No" />
                    </FormGroup>
                    */}
                    <FormGroup>
                      <Label>My Phone Number</Label>
                      <CustomInput type="radio" name="phone" label="Yes" />
                      <CustomInput type="radio" name="phone" checked label="No" />
                    </FormGroup>
                    <FormGroup>
                      <Label>My Email Address</Label>
                      <CustomInput type="radio" name="email" label="Yes" />
                      <CustomInput type="radio" name="email" checked label="No" />
                    </FormGroup>
                  </Col>
                </Row>
                <div className="text-right mt-2 mr-4 mb-4">
                  <Button type="button" color="link" onClick={() => { this.toggleTabConfirmation('1'); }}>{data.modal.confirmation.buttons.cancel}</Button>
                  <Button type="button" color="primary" className="ml-3" onClick={() => { this.toggleTabConfirmation('3'); }}>{data.modal.confirmation.buttons.save}</Button>
                </div>
              </TabPane>
              <TabPane tabId="3">
                <p className="text-center mt-4">
                  <img src={window._env_.PUBLIC_URL + "/images/logo.svg"} alt="logo" />
                </p>
                <div className="radio-form p-5">
                  <div className="product mb-4">
                    <p>BXRetail is now approved to share the following with our Professional Services partner AnyTVPartner:</p>
                  </div>
                  {/*
                  <FormGroup>
                    <Label>My Ship To/Installation Address</Label>
                    <CustomInput type="radio" name="address2" label="Yes" />
                    <CustomInput type="radio" name="address2" checked label="No" />
                  </FormGroup>
                  */}
                  <FormGroup>
                    <Label>My Phone Number</Label>
                    <CustomInput type="radio" name="phone2" label="Yes" />
                    <CustomInput type="radio" name="phone2" checked label="No" />
                  </FormGroup>
                  <FormGroup>
                    <Label>My Email Address</Label>
                    <CustomInput type="radio" name="email2" label="Yes" />
                    <CustomInput type="radio" name="email2" checked label="No" />
                  </FormGroup>
                  <div className="text-right mt-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTabConfirmation('2'); }}>Change Settings</Button>
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
