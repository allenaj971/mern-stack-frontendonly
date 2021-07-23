import { Nav, Navbar, Container } from 'react-bootstrap'
import {
  Switch,
  BrowserRouter as Route
} from "react-router-dom";
import Profile from './components/Profile'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import NewPost from './components/NewPost'
import Users from './components/Users';
// import './styles.css'

function App() {
  const logOut = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div >
      <Navbar bg="light" expand="xl">
        <Container>
          <Navbar.Brand href="/">Allen's Blog</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!localStorage.getItem('token') &&
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/register">Register</Nav.Link>
                </>
              }
              {localStorage.getItem('token') &&
                <>
                  <Nav className='me-auto'>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                    <Nav.Link href='/addpost'>Create new post</Nav.Link>
                    <Nav.Link href='/users'>Find and follow other users</Nav.Link>
                    <Nav.Link onClick={logOut}>Logout</Nav.Link>
                  </Nav>
                </>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* logic for routing */}
      <Switch>
        <Route exact path="/" >
          <Home />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/addpost">
          <NewPost />
        </Route>
        <Route exact path="/users">
          <Users />
        </Route>
      </Switch>
    </div >
  );
}

export default App;
