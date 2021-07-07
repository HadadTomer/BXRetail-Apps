// Packages
import React from 'react';
import { withRouter } from "react-router"; /* PING INTEGRATION: */
import {
  Button, Row, Col, Card, CardBody,
  Container,
  Media
} from 'reactstrap';


// Components
import NavbarMain from '../../components/NavbarMain';
import FooterMain from '../../components/FooterMain';

// Data
import data from '../../data/partner.json';

// Styles
import '../../styles/pages/partner.scss';

// Autocomplete Suggestion List
const SuggestionsList = props => {
  const {
    suggestions,
    inputValue,
    onSelectSuggestion,
    displaySuggestions,
    selectedSuggestion
  } = props;

  if (inputValue && displaySuggestions) {
    if (suggestions.length > 0) {
      return (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => {
            const isSelected = selectedSuggestion === index;
            const classname = `suggestion ${isSelected ? "selected" : ""}`;
            return (
              <li
                key={index}
                className={classname}
                onClick={() => onSelectSuggestion(index)}
              >
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    } else {
      return <ul className="suggestions-list"><li className="suggestion">No suggestions available...</li></ul>;
    }
  }
  return <div></div>;
};

// Search Autocomplete
const SearchAutocomplete = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = React.useState(0);
  const [displaySuggestions, setDisplaySuggestions] = React.useState(false);
  const onChange = event => {
    const value = event.target.value;
    setInputValue(value);
    const filteredSuggestions = data.clients.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filteredSuggestions);
    setDisplaySuggestions(true);
  };
  const onSelectSuggestion = index => {
    setSelectedSuggestion(index);
    setInputValue(filteredSuggestions[index]);
    setFilteredSuggestions([]);
    setDisplaySuggestions(false);
  };
  return (
    <div>
      <form className="form-search form-inline float-right">
        <input className="form-control user-input" type="text" placeholder={data.clients.search_placeholder} onChange={onChange} value={inputValue} />
        <SuggestionsList
          inputValue={inputValue}
          selectedSuggestion={selectedSuggestion}
          onSelectSuggestion={onSelectSuggestion}
          displaySuggestions={displaySuggestions}
          suggestions={filteredSuggestions}
        />
        <img src={window._env_.PUBLIC_URL + "/images/icons/search.svg"} className="img-search" />
      </form>
    </div>
  );
};

// PartnerClient Page
class PartnerClient extends React.Component {

  componentDidMount() {
    // const username = this.props.location.state.username;
    console.log("passed username", this.props);
  }
  render() {
    return (
      <div className="accounts advisor">
        <NavbarMain data={data} />
        <section className="welcome-bar">
          <Container>
            <Row>
              <Col lg="12">
                <h3>{data.welcome_bar}</h3>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="section-content">
          <Container>
            <Row>
              <Col lg="4">
                <h5>{data.profile.partner.title}</h5>
                <Card>
                  <CardBody>
                    <Media>
                      <Media left href="#">
                        <Media object src={window._env_.PUBLIC_URL + "/images/anywealthadvisor-photo.png"} alt="Generic placeholder image" />
                      </Media>
                      <Media body>
                        <p dangerouslySetInnerHTML={{__html: data.profile.partner.content}}></p>
                        <Button color="link">{data.profile.partner.button}</Button>
                      </Media>
                    </Media>
                  </CardBody>
                </Card>
                <h5 className="mt-5">{data.alerts.title}</h5>
                <Card className="mb-5">
                  <CardBody>
                    {
                      Object.keys(data.alerts.messages).map(key => {
                        return (
                          <p key={key} dangerouslySetInnerHTML={{__html: data.alerts.messages[key]}}></p>
                        );
                      })      
                    }
                    <Button color="link">{data.alerts.button}</Button>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="8">
                <div>
                  <Row>
                    <Col>
                      <h5 className="mb-4">{data.clients.title}</h5>
                    </Col>
                    <Col>
                      <SearchAutocomplete />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {data.clients.orders.map((order) => (
                        <div className="module">
                          <Container>
                            <Row className="pt-4 pb-3 pl-2 pr-2">
                              <Col>
                                <span className="client-order_title">
                                  {order.name} {order.id} | <Button color="link" className="pl-1">{order.tracking_link}</Button>
                                </span>
                              </Col>
                            </Row>
                            <Row className="pb-4 pl-2 pr-2">
                              <Col sm="4">
                                <div className="client-order_name">
                                  {order.contact_details.full_name}
                                </div>
                                <div className="client-order_address">
                                  <div>
                                    {order.contact_details.address.title}
                                  </div>
                                  <div>
                                    {order.contact_details.address.data.line_1}
                                  </div>
                                  <div>
                                    {order.contact_details.address.data.city}, {order.contact_details.address.data.state} {order.contact_details.address.data.postcode}
                                  </div>
                                  <Button color="link">
                                    {order.contact_details.address.edit_link}
                                  </Button>
                                </div>
                                <div className="client-order_phone">
                                  <div>
                                    {order.contact_details.phone_numbers.title}
                                  </div>
                                  {order.contact_details.phone_numbers.data.map((number) => (
                                    <div>{number.name}: {number.data}</div>
                                  ))}
                                  <Button color="link">
                                    {order.contact_details.address.edit_link}
                                  </Button>
                                </div>
                                <div className="client-order_email">
                                  <div>
                                    {order.contact_details.email.title}
                                  </div>
                                  <div>
                                    {order.contact_details.email.data}
                                  </div>
                                  <Button color="link">
                                    {order.contact_details.address.edit_link}
                                  </Button>
                                </div>
                              </Col>
                              <Col sm="8">
                                {order.order_details.products.map((product) => (
                                  <Row>
                                    <Col>
                                      <img
                                        src={window._env_.PUBLIC_URL + product.image_url}
                                        className="img-fluid"
                                      />
                                    </Col>
                                    <Col>
                                      <div>
                                        {product.title}
                                      </div>
                                      <ul className="client-order_list">
                                        {product.names.map((name) => (
                                          <li>{name}</li>
                                        ))}
                                      </ul>
                                      <Button className="mt-3" color="link">
                                        {product.product_link}
                                      </Button>
                                    </Col>
                                  </Row>
                                ))}
                                <Row className="mt-4">
                                  <Col>
                                    <div>
                                      {order.order_details.services.title}:
                                    </div>
                                    <ul className="client-order_list mt-3">
                                      {order.order_details.services.data.map((order) => (
                                        <li>{order}</li>
                                      ))}
                                    </ul>
                                    <Button className="mt-3" color="link">
                                      {order.order_details.services.instructions_link}
                                    </Button>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Container>
                        </div>
                      ))}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <FooterMain />
      </div>
    );
  }
}

export default withRouter(PartnerClient);
