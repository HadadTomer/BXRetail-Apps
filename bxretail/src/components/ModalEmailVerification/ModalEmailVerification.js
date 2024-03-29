/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

// Packages
import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col
} from 'reactstrap';

// Styles
import './ModalEmailVerification.scss';

// Data
import data from './data.json';

class ModalEmailVerification extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} className="modal-xl modal-email-verification">
          <ModalHeader toggle={this.toggle.bind(this)}></ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="6" xl="4" className="col-download">
                <h4>{data.download.title}</h4>
                <p dangerouslySetInnerHTML={{__html: data.download.content}}></p>
                <div className="mb-3"><img src={process.env.PUBLIC_URL + "/images/app-store-logos.svg"} /></div>
                <p dangerouslySetInnerHTML={{__html: data.download.learn}}></p>
                <img src={process.env.PUBLIC_URL + "/images/device-with-logo.png"} alt="device" className="device-with-logo" />
              </Col>
              <Col lg="6" xl="8" className="col-content">
                <h3>{data.confirmation.title}</h3>
                <div dangerouslySetInnerHTML={{__html: data.confirmation.content}}></div>
                <div className="mt-4">
                  <Button type="button" color="primary" onClick={this.toggle.bind(this)}>{data.confirmation.buttons.learn}</Button>
                  <Button type="button" color="link" className="ml-3" onClick={this.toggle.bind(this)}>{data.confirmation.buttons.close}</Button>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ModalEmailVerification;
