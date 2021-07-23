import { useState } from "react"
import { Col, Alert, Row, Container, Button, Form } from "react-bootstrap"
// import { Redirect, useHistory } from 'react-router-dom'
import { useEffect } from "react"
require('dotenv').config()

export default function Profile() {
    const [data, setData] = useState(null)
    const [loadProfileErr, setLoadProfileErr] = useState(null)
    const [editProfileErr, setEditProfileErr] = useState(null)

    // fetch profile data
    useEffect(() => {
        fetchData()
        // eslint-disable-next-line
    }, [])

    // function to fetch profile datas
    const fetchData = async () => {
        const token = JSON.parse(localStorage.getItem("token"))

        fetch(`https://mern-stack-allen.herokuapp.com/users/profile`, {
            credentials: 'include',
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token })
        }).then(res => {
            // sets res status to loadProfileErr to check if user is authorized
            setLoadProfileErr(res.status)
            return res.json()
        }).then(data => {
            // sets data to display to user
            setData(data)
        })
        console.log(data)
    }

    // checks if user is authorized
    if (loadProfileErr === 401 || editProfileErr === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
    }

    // when user clicks editprofile it gets the form values and posts them
    const editProfile = async (e) => {
        e.preventDefault()
        const updated = {}
        updated['token'] = JSON.parse(localStorage.getItem("token"))

        for (var i = 0; i < e.target.length; i++) {
            if (e.target[i].value) {
                updated[e.target[i].id] = e.target[i].value
            }
        }

        fetch(`https://mern-stack-allen.herokuapp.com/users/editprofile`, {
            credentials: 'include',
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
        }).then(res => setEditProfileErr(res.status))
    }

    // check if edit profile details are valid
    const dispErr = (err) => {
        if (err === 200) {
            setTimeout(() => { window.location.href = '/profile' }, 2000)
            return <Alert variant='success'>
                Success!
            </Alert>

        } else if (err === 400) {
            return <Alert variant='danger'>
                Username/Email taken!
            </Alert>
        }
    }

    return (
        <Container fluid>
            <Row className="justify-content-center">
                {data &&
                    <Col xs sm='8' lg='5'>
                        <br></br>
                        <Row>
                            <h1>Your Profile</h1>
                        </Row>
                        <br></br>
                        <Form onSubmit={editProfile}>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder={data.profile.username} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder={data.profile.email} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="firstname">
                                <Form.Label>First name</Form.Label>
                                <Form.Control type="text" placeholder={data.profile.firstname} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="lastname">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control type="text" placeholder={data.profile.lastname} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" placeholder={data.profile.address} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="phoneNumber">
                                <Form.Label>Phone number</Form.Label>
                                <Form.Control type="text" placeholder={data.profile.phoneNumber} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="******" />
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{ cursor: 'pointer' }}>
                                Edit Profile
                            </Button>
                        </Form>
                        <br></br>
                        <Row>
                            {dispErr(editProfileErr)}
                        </Row>
                    </Col>
                }
            </Row>


        </Container >
    )
}

