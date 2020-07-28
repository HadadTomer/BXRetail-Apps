/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

// Packages
import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  CustomInput,
  TabContent, TabPane
} from 'reactstrap';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

// Styles
import "./ModalError.scss";

// Data
import data from './data.json';

class ModalError extends React.Component {
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
    const closeBtn = <div />;
    return (
      <div>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} className="modal-error">
          <ModalHeader toggle={this.toggle.bind(this)} close={closeBtn}><img src={process.env.PUBLIC_URL + "/images/logo.svg"} alt="logo" /></ModalHeader>
          <ModalBody>
            <h4>{data.title}</h4>
            <div dangerouslySetInnerHTML={{__html: data.content}}></div>
            <Button color="primary" onClick={this.toggle.bind(this)}>{data.button}</Button>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ModalError;
