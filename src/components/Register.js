import { useState } from "react"
import { Col, Row, Container, Form, Button } from "react-bootstrap"

export default function Register() {
    const [err, setErr] = useState()

    const register = (e) => {
        e.preventDefault()
        var newUser = {}

        // check if confirm passwords match
        if (e.target[6].value !== e.target[7].value) {
            alert("Passwords don't match!")
            // if they match, set form values to dict newUser
        } else if (e.target[6].value === e.target[7].value) {
            // check if form is filled
            if (e.target.length >= 7) {
                for (var i = 0; i < (e.target.length); i++) {
                    // console.log(e.target[i].id + '\n' + e.target[i].value)
                    newUser[e.target[i].id] = e.target[i].value
                }

                fetch(`https://mern-stack-allen.herokuapp.com/users/register`, {
                    credentials: 'include',
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser)
                }).then(res => { setErr(res.status) })

                if (err === 200) {
                    alert('Success')
                    setTimeout(() => {
                        window.location.href = '/login'
                    }, 1000)
                } else if (err === 500) {
                    alert('Username or email is already taken!')
                }
            } else {
                alert('Fill out form!')
            }
        }
    }

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs sm='8' lg='5'>
                    <br></br>
                    <Row>
                        <h2>Register a new user</h2>
                    </Row>
                    <br></br>
                    <Form onSubmit={register}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Enter username</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Enter email</Form.Label>
                            <Form.Control type="email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="firstname">
                            <Form.Label>Enter first name</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="lastname">
                            <Form.Label>Enter last name</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="address">
                            <Form.Label>Enter address</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="phoneNumber">
                            <Form.Label>Enter phone number</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Ensure that you have a strong password" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="confirmpassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm your password" />
                        </Form.Group>

                        <Button variant="primary" type="submit" style={{ cursor: 'pointer' }}>
                            Register a new user
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>

    )
}
