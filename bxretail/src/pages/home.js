// Packages
import React from 'react';
import { Button, Jumbotron, Container, Row, Col } from 'reactstrap';

// Components
import NavbarMain from '../components/NavbarMain';
import ModalBirthday from '../components/ModalBirthday/';
import FooterMain from '../components/FooterMain';

// Data
import data from '../data/home.json';

// Styles
import '../styles/pages/home.scss';

class Home extends React.Component {
  triggerModalBirthday() {
    this.refs.modalBirthday.toggle();
  }
  render() {
    return (
      <div className="home">
        <NavbarMain></NavbarMain>
        <Jumbotron fluid className="jumbotron-hero-home">
          <Container>
            <Row>
              <Col md="5" className="electronics" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/home-hero-electronics-bg.jpg)`}}>
                <h2>{data.hero.electronics.title}</h2>
                <p>{data.hero.electronics.content}</p>
                <a href="/shop" className="btn btn-primary">{data.hero.electronics.button}</a>
              </Col>
              <Col md="7" className="office" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/home-hero-office-bg.png)`}}>
                <div className="office-content">
                  <h2>{data.hero.office.title}</h2>
                  <p className="lead">{data.hero.office.subtitle}</p>
                  <p>{data.hero.office.content}</p>
                  <a href="/shop" className="btn btn-primary">{data.hero.office.button}</a>
                </div>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
        <section className="section-home-cta-bar">
          <Container>
            <Row>
              <Col lg="7">
                <h4 dangerouslySetInnerHTML={{__html: data.cta_bar}}></h4>
              </Col>
              <Col lg="5">
                <Row className="align-items-center">
                  <Col><img src={process.env.PUBLIC_URL + "/images/logo-bxclothes.svg"} alt="BXClothes" /></Col>
                  <Col><img src={process.env.PUBLIC_URL + "/images/logo-bxhome.svg"} alt="BXClothes" /></Col>
                  <Col><img src={process.env.PUBLIC_URL + "/images/logo-bxoffice.svg"} alt="BXClothes" /></Col>
                  <Col><img src={process.env.PUBLIC_URL + "/images/logo-bxtech.svg"} alt="BXClothes" /></Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="section-home-features">
          <Container>
            <Row>
              {data.features.map((item, i) => {
                return (
                  <Col md="4" key={i}>
                    <img src={process.env.PUBLIC_URL + "/images/" + item.image} alt={item.title} className="img-fluid" />
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                    <Button color="link" onClick={this.triggerModalBirthday.bind(this)}>{item.button}</Button>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>
        <FooterMain></FooterMain>
        <ModalBirthday ref="modalBirthday" />
      </div>
    );
  }
}

export default Home;
