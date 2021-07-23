import { Row, Form, Button, Alert, Container, Col } from "react-bootstrap"
import { useState, useEffect } from "react"

export default function Login() {
    const [err, setErr] = useState()
    const [validToken, setValidToken] = useState()

    // checking if user's token is
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        fetch(`https://mern-stack-allen.herokuapp.com/users/isvalidtoken`, {
            credentials: 'include',
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token })
        }).then(res => setValidToken(res.status))
    }, [])

    // if user is already logged in
    if (validToken === 200) {
        window.location.href = '/'
    }

    // this will display any errors when trying to log in 
    const dispErr = (err) => {
        if (err === 200) {
            const success = <Alert variant='success'>
                Success!
            </Alert>

            setTimeout(() => {
                window.location.href = '/'
            }, 1000)

            return success
        } else if (err === 401) {
            return <Alert variant='danger'>
                Invalid credentials
            </Alert>
        } else if (err === 404) {
            return <Alert variant='warning'>
                User not found
            </Alert>
        } else if (err === 400) {
            return <Alert variant='info'>
                Enter your credentials!
            </Alert>
        }
    }

    // handles the login post request on form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        const email = e.target[0].value
        const pass = e.target[1].value

        await fetch(`https://mern-stack-allen.herokuapp.com/users/login`, {
            credentials: 'include',
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: pass })
        }).then(res => {
            setErr(res.status);
            res.json().then(data => {
                localStorage.setItem('token', JSON.stringify(data))
            })
        })
    }


    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs sm='5' lg='5'>
                    <Row>
                        <br></br>
                        <h1>Login</h1>
                        <br></br>
                    </Row>
                    <Row>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit" style={{ cursor: 'pointer' }}>
                                Submit
                            </Button>
                        </Form>
                    </Row>
                    <br></br>
                    <Row>
                        {dispErr(err)}
                    </Row>
                </Col>
            </Row>
            <br></br>

        </Container >
    )
}
