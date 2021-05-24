// Packages
import React from 'react';
import { Container, Row, Col } from 'reactstrap';

// Styles
import "./WelcomeBar.scss";

const WelcomeBar = (props) => {
  return (
    <div className="welcome-bar">
      <Container>
        <Row>
          <Col lg="12">
            <h3>{props.title || "Welcome, Guest"}{props.firstName && ", "+props.firstName}</h3>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WelcomeBar;
