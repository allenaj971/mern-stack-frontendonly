import { useState, useEffect } from 'react'
import { Container, Form, Row, Col, FormControl, Button, ListGroup } from 'react-bootstrap'

export default function Users() {
    const [pageErr, setPageErr] = useState()
    const [results, setResults] = useState()
    const [profile, setProfile] = useState()

    // checking if user's token is valid
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        fetch(`https://mern-stack-allen.herokuapp.com/users/profile`, {
            credentials: 'include',
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        }).then(res => { setPageErr(res.status); return res.json() }).then(data => setProfile(data))


    }, [])

    // if user is already logged in
    if (pageErr === 401) {
        window.location.href = '/login'
    }



    // search functionality
    const search = (e) => {
        e.preventDefault()

        fetch(`https://mern-stack-allen.herokuapp.com/users/findusers/${e.target[0].value}`, {
            credentials: 'include',
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then(res => { setPageErr(res.status); return res.json() }).then(data => setResults(data))
    }

    // follow function
    const follow = (id) => {
        if (id) {
            const token = JSON.parse(localStorage.getItem('token'))
            fetch(`https://mern-stack-allen.herokuapp.com/users/follow/${id}`, {
                credentials: 'include',
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token })
            })
        }
        setTimeout(() => {
            window.location.href = '/users'
        }, 500)
    }

    // unfollow func
    const unfollow = (id) => {
        if (id) {
            const token = JSON.parse(localStorage.getItem('token'))
            fetch(`https://mern-stack-allen.herokuapp.com/users/unfollow/${id}`, {
                credentials: 'include',
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token })
            })
        }
        setTimeout(() => {
            window.location.href = '/users'
        }, 500)
    }
    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs sm='8' lg='5'>
                    <br></br>
                    <h1>Find and follow other users</h1>
                    <br></br>
                    <Form className="d-flex" onSubmit={search}>
                        <FormControl
                            type="search"
                            placeholder="Search"
                            className="mr-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success" type='submit' style={{ cursor: 'pointer' }}>Search</Button>
                    </Form>
                    <br></br>
                    <Row>
                        <ListGroup>
                            {(results && profile) ?
                                <>
                                    <h4>By username</h4>
                                    {results.map((item, index) => {
                                        return (
                                            <>
                                                {profile.profile._id !== item._id &&
                                                    <>
                                                        <ListGroup.Item>@{item.username}</ListGroup.Item>
                                                        {profile.profile.followings.indexOf(item._id) === -1 ?
                                                            <Button className='btn btn-success btn-sm' style={{ cursor: 'pointer' }} onClick={() => { follow(item._id) }}>Follow</Button> :
                                                            <Button className='btn btn-danger btn-sm' style={{ cursor: 'pointer' }} onClick={() => { unfollow(item._id) }}>Unfollow</Button>
                                                        }
                                                        <br></br>
                                                    </>
                                                }
                                            </>
                                        )
                                    })}
                                </>
                                :
                                <>
                                    <h4>People you follow</h4>
                                    {profile && profile.followings.map((item, index) => {
                                        return (
                                            <>
                                                {/* ensure when followers loads, it doesn't contain the user themselves */}
                                                {profile.profile._id !== item._id &&
                                                    <>
                                                        < ListGroup.Item key={index}>@{item.username}</ListGroup.Item>
                                                        <Button className='btn btn-danger btn-sm' style={{ cursor: 'pointer' }} onClick={() => { unfollow(item._id) }}>Unfollow</Button>
                                                        <br></br>
                                                    </>
                                                }
                                            </>
                                        )
                                    })}
                                </>
                            }
                        </ListGroup>
                    </Row>
                </Col>
            </Row>
        </Container >
    )
}
