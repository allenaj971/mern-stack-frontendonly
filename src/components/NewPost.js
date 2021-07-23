import { Row, Form, Button, Container, Col, Alert } from "react-bootstrap"
import { useState } from "react"

export default function NewPost() {
    const [err, setErr] = useState()

    // handle submitting new post
    const handleSubmit = (e) => {
        e.preventDefault()
        const title = e.target[0].value
        const content = e.target[1].value

        const newPost = { title: title, content: content }
        newPost['token'] = JSON.parse(localStorage.getItem("token"))

        fetch(`https://mern-stack-allen.herokuapp.com/posts/addpost`, {
            credentials: 'include',
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost)
        }).then(res => setErr(res.status))
    }

    if (err === 401 || !localStorage.getItem('token')) {
        // localStorage.removeItem('token')
        window.location.href = '/login'
    }

    const dispErr = (error) => {
        if (error === 200) {
            setTimeout(() => { window.location.href = '/' }, 2000)
            return <Alert variant='success'>
                Success!
            </Alert>

        } else if (error === 401) {
            return <Alert variant='danger'>
                Unauthorized
            </Alert>
        }
    }

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs sm='10' lg='8'>
                    <br></br>
                    <Row>
                        <br></br>
                        <h1>Create new post</h1>
                        <br></br>
                    </Row>
                    <Row>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" required placeholder="Enter title" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="content">
                                <Form.Label>Content</Form.Label>
                                <Form.Control as="textarea" required rows={3} placeholder='Enter content' />
                            </Form.Group>
                            <Button variant="info" type="submit" style={{ cursor: 'pointer' }}>
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

        </Container >
    )
}
