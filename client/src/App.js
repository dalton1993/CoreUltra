import React, { useEffect, createContext, useReducer, useContext } from 'react'
import Navbar from './components/navbar.js'
import Sidebar from './components/sidebar.js'
import NewsFeed from './components/newsFeed.js'
import SideBarComponent from "./components/coreUltra.js"
import MainSearch from "./components/mainSearch.js"
import UserTag from "./components/userTag.js"
import MinNav from "./components/minNav.js"
import "./App.css";
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom'
import Home from "./components/screens/home.js"
import Signin from "./components/screens/signin.js"
import Signup from "./components/screens/signup.js"
import Profile from "./components/screens/profile.js"
import CreatePost from "./components/screens/createpost.js"
import UserProfile from "./components/screens/UserProfile.js"
import SubUserPost from "./components/screens/SubUserPost.js"
import NewsContextProvider from "./contexts/newsContext"
import { reducer, initialState } from "./reducer/userReducer.js"
import { Modal } from 'materialize-css';
import { Container, Row, Col } from 'react-bootstrap';
import Following from './components/following.js'; 


export const UserContext = createContext()

 const Routing = () => {

  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      console.log(user)
      dispatch({type:"USER", payload:user})
      history.push('/')
    } else {
      history.push('/signin')
    }
  },[]) 

  return (
    <Switch>
        <Route exact path ="/">
          <Home/>
        </Route>
        
        <Route path = "/signin">
          <Signin/>
        </Route>

        <Route path = "/signup">
          <Signup/>
        </Route>

        <Route exact path = "/profile">
          <Profile/>
        </Route>

        <Route path = "/createpost">
          <CreatePost/>
        </Route>

        <Route path = "/profile/:userid">
          <UserProfile/>
        </Route>

        <Route path = "/myfollowingpost">
          <SubUserPost/>
        </Route>
      </Switch>
  )
}

function App() {
  const [ state, dispatch ] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state:state, dispatch:dispatch}}>
      <NewsContextProvider>
      <BrowserRouter>
      <Container fluid style = {{height:'100vh'}}>
      
       
          <Row>

            <Col xl = {3} lg = {3} className = 'd-none d-xl-flex' style = {{backgroundColor:'rgb(80,80,80)', padding:'0'}}>
              < UserTag/>
            </Col>

            <Col xl = {6} lg = {12} className = 'd-flex flex-column justify-content-center' style = {{padding:'0'}}>
              < SideBarComponent/>

            </Col>

            <Col xl = {3} className = 'd-none d-xl-flex justify-content-center' style = {{padding:'0', backgroundColor:'rgb(80,80,80)'}}>
              < MainSearch />
            </Col>
          </Row>

          <Row style = {{marginTop:'10px'}}>

            <Col xl = {3} lg = {3} className = 'd-none d-xl-flex flex-column'>
              <Row>
                <Col>
                  < Sidebar/>
                </Col>
              </Row>
             
              <Row>
                <Col>
                  < Following />
                </Col>
              </Row>
            </Col>

            <Col xl ={6} lg = {12} md = {12} className = 'd-flex justify-content-center main-feed'
            style = {{
              overflowY:'scroll',
              height:'92vh'
            }}
            >
              < Routing />
            </Col>

            <Col xl = {3} className = 'd-none d-lg-flex justify-content-end news-feed'
            style = 
            {{
              paddingRight:'35px',
              overflowY:'scroll',
              height:'92vh'
              }}>
              < NewsFeed />
            </Col>
          </Row>

          < MinNav/>

 
      </Container>
      </BrowserRouter>
      </NewsContextProvider>
    </UserContext.Provider>
  );
}

export default App;
