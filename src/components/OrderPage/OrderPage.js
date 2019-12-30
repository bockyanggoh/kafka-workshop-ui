import React, {Component} from 'react';
import axios from 'axios';
import {
  Card,
  CardSubtitle,
  CardBody,
  CardTitle,
  Col,
  Row,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  ListGroup,
  Form, Button, Alert
} from "shards-react";
class OrderPage extends Component {
    state = {
      isLoading: true,
      items: [],
      order: [],
      currentOrder: {},
      currentPayment: {},
      alert: {
        show: false,
        content: ''
      }
    };
    constructor() {
        super();
        this.loadItems();
    }
    render() {
      const {isLoading, alert} = this.state;

      return isLoading ?
        <p>Loading...</p> :
        <div>
          {alert.show ? <Alert theme={"success"}>
            Successfully placed order. Click here to view Order {alert.content.orderId}
          </Alert> : ''}
          <h4>Available Items Catalogue</h4>
          <section id="items">
            <Row style={{marginLeft:"2px", marginRight:"2px", paddingLeft: "2px", paddingRight: "2px"}}>
              {this.renderItemCards()}
            </Row>
          </section>
          <section>
            <div>
              {this.renderOrderForm()}
            </div>
          </section>
        </div>
    }


    loadItems = async () => {
        await  axios.get("https://localhost:5001/api/v1/item")
            .then(res => {
                this.setState({items: res.data.itemData, isLoading: false})
            })
    }

    renderItemCards = () => {
        if(this.state.items.length > 0) {
            return this.state.items.map((value, key) =>
                <Col key={value.itemId} style={{width:"30%"}}>
                    <Card className={value.itemId} onClick={(element) => {this.addItemToOrder(value)}} >
                        <CardBody>
                            <CardTitle>
                                {value.itemName}
                            </CardTitle>
                            <CardSubtitle>
                                Cost Price: ${value.costPrice}
                            </CardSubtitle>
                        </CardBody>
                    </Card>
                </Col>

            )
        }

        return <p>No items found. Start by creating one?</p>
    }

    addItemToOrder = (item) => {
        const {order} = this.state;
        console.log(item);
        order.push(item);
        this.setState({order: order})
    }

    renderOrderForm = () => {
      const {order} = this.state;
      const renderedOrderItems = order =>{
        return order.map((value, key) =>
          <ListGroupItem key={value.itemId}>
            <ListGroupItemHeading>Item #{key}: {value.itemName}</ListGroupItemHeading>
            <ListGroupItemText>Cost: {value.costPrice}</ListGroupItemText>
          </ListGroupItem>
        )
      };
      console.log(order.length);
      return(
        <Form>
          {order.length > 0 ? (
            <div>
              <ListGroup>
                {renderedOrderItems(order)}
              </ListGroup>
              <Button onClick={this.submitOrder}>
                Submit Order
              </Button>
            </div>
          ) :
            <p>Add an item to the order!</p>
          }
        </Form>
      )
    }

    submitOrder = async () => {
      const {order} = this.state;
      const orderIds = order.map((v, k) => v.itemId);
      const orderContent = {

      }
      await axios.put('https://localhost:5001/api/v1/Order', {
        "username": "test",
        "orderIds": orderIds})
        .then(res => {
          console.log(res);
          // axios.get('https://localhost:5002/api/v1/Payment?orderId='+res.data.itemData.orderId)
          //   .then(res => {
          //     console.log(res);
          //     this.setState({currentPayment: res})
          //   })
          this.setState({
            alert: {
              show: true,
              content: res
            }
          })
        }).catch( err => {
        console.log(err)
      })
    }
}

export default OrderPage;