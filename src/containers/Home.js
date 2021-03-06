import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Button, Col, Row, Container} from "react-bootstrap";
import "./Home.css";
import { LinkContainer } from "react-router-bootstrap";
import { Auth, getUserById, deleteClassFromUser } from "../firebase";
import ClassModal from './Modal'
import courseData from "../data/4770/courses.json";

export default function Home(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {onLoad()}, [isLoading, user]);
  Auth.onAuthStateChanged(() => setUser(Auth.currentUser));

  async function onLoad() {
    if (!Auth.currentUser) { return; }
    await getUserById(Auth.currentUser.email)
    .then(data => {
      setName(data.name);
      setClasses(data.classes);
    }).catch(err => alert(err));

    setIsLoading(false);
  }

  //pass user to /message
  var path = {
    pathname:'/message',
    query: name,
  }

  function renderClassList() {
    return(
    <>
      <LinkContainer key="new" to="/search">
        <ListGroupItem>
            <b>{"\uFF0B"}</b> Add a new class
        </ListGroupItem>
      </LinkContainer>

      <ListGroup>
        {classes.map(clsId => renderClass(clsId))}
      </ListGroup>

      <LinkContainer to={path}>
        <ListGroupItem>
            <b>{"\uFF0B"}</b> Send Message
        </ListGroupItem>
      </LinkContainer>
    </>
    );
  }

  function searchClassAttribute(id){
    for(var i = 0; i < courseData.length; i++){
      if(courseData[i].id == id){
        var classAttribute = courseData[i].subject + " " + courseData[i].catalog_num;
        return classAttribute;
      }
    }
  }

  function handleClick(props){
    //console.log("呃呃，还是删除"+props+"吧");
    deleteClassFromUser(props, Auth.currentUser.email);
    setIsLoading(true);
  }

  function renderClass(clsId){
    //pass the data?
    //props.history.push(path);
    return(
    <>
      <ListGroupItem key={clsId.toString()}>
        <Row>
          <Col md={4}>
            <ClassModal name={searchClassAttribute(clsId)} id={clsId}/>
          </Col>
          <Col md={{ span: 1, offset: 6 }}>
            <Button variant="outline-dark" onClick={()=>handleClick(clsId)}>Delete</Button>
          </Col>
        </Row>
      </ListGroupItem>
    </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Metchup</h1>
        <p>A simple way to find study partner</p>
      </div>
    );
  }


  function renderDashboard() {
    var message = <span><strong>Welcome, {name}.</strong></span>;
    return (
      <Container className="notes">
        <h1>{message}</h1>
        <h4>Let's play around with your dashboard to find study groups.</h4>
        <ListGroup>
          {!isLoading && renderClassList()}
        </ListGroup>
      </Container>
    );
  }


  return (
    <div className="Home">
      {Auth.currentUser ? renderDashboard() : renderLander()}
    </div>
  );
}
