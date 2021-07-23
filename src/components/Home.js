import { useEffect, useState } from "react"
import { Col, Row, Container, Card, Button, Form, Modal, Alert } from "react-bootstrap"

export default function Home() {
    const [data, setData] = useState()
    // toggle edit post view
    const [toggleEditPost, setToggleEditPost] = useState(false)
    // set post data so that the user can see what was there in the original post
    const [editPostData, setEditPostData] = useState()
    // set any errs in the page
    const [err, setErr] = useState(null)
    // set user id in the page to allow to edit only user-generated posts
    const [userid, setUserid] = useState()

    // toggle delete post stuff
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);


    // get all posts
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))

        fetch(`https://mern-stack-allen.herokuapp.com/posts/`, {
            credentials: 'include',
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        }).then(res => { return res.json() }).then(data => setData(data))

        // use base64decode to ensure edit and delete buttons work only for the user's posts
        const token1 = localStorage.getItem('token').split('.')
        const id = Buffer.from(token1[1], 'base64').toString()
        setUserid(JSON.parse(id))
    }, [])

    // check if user is authorized to access home page
    if (err === 401 || !localStorage.getItem('token')) {
        // localStorage.removeItem('token')
        window.location.href = '/login'
    }

    // handle delete
    const handleDelete = (id) => {
        const token = JSON.parse(localStorage.getItem('token'))

        fetch(`https://mern-stack-allen.herokuapp.com/posts/deletepost`, {
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ token, postid: id })
        })

        // setTimeout(() => {
        window.location.href = '/'
        // }, 2000)
    }

    // handle edit
    const handleEdit = (e) => {
        e.preventDefault()

        const token = JSON.parse(localStorage.getItem('token'))
        const postid = editPostData.id
        // mongodb seems to accept values even if title or content is
        // empty, so we check them here to ensure they are not empty
        // if the fields are empty, then the user doesn't want to change it so 
        // we post the original values
        var title
        if (e.target[1].value.length > 0) {
            title = e.target[1].value
        } else {
            title = editPostData.title
        }
        var content
        if (e.target[2].value.length > 0) {
            content = e.target[2].value
        } else {
            content = editPostData.content
        }

        e.preventDefault()
        fetch(`https://mern-stack-allen.herokuapp.com/posts/editpost`, {
            credentials: "include",
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, postid, title, content })
        }).then(res => { setErr(res.status); return res.json() })
    }

    // this will display success when trying to edit posts 
    const dispErr = () => {
        if (err) {
            setTimeout(() => {
                window.location.href = '/'
            }, 1000)
            return <Alert variant='success'>
                You have edited your post
            </Alert>
        }
    }

    return (
        <Container fluid>
            <Row className="justify-content-center" md='auto'>
                <Col xs sm='10' lg='8'>
                    <br></br>
                    {/* Toggles the title */}
                    <Row>
                        {!toggleEditPost ? <h2>Posts by you and your followers</h2> : <h5>Edit post</h5>}
                    </Row>
                    {/* This part handles the form */}
                    {toggleEditPost &&
                        <>
                            <Row>
                                <Form onSubmit={handleEdit}>
                                    <Button variant='primary' style={{ cursor: 'pointer' }} onClick={() => { setToggleEditPost(!toggleEditPost) }}>Cancel edit</Button>
                                    <Form.Group className="mb-3" controlId="title">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" placeholder={editPostData.title} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="content">
                                        <Form.Label>Content</Form.Label>
                                        <Form.Control as="textarea" rows={8} placeholder={editPostData.content} />
                                    </Form.Group>

                                    <Button variant="info" type="submit" style={{ cursor: 'pointer' }}>
                                        Confirm edit post
                                    </Button>
                                </Form>
                            </Row>
                            <br></br>
                            <Row>{dispErr(err)}</Row>
                        </>
                    }
                    {(!toggleEditPost && userid && data && data.length > 0) && data.map((item, index) => {
                        return (
                            <>
                                <br></br>
                                {/* this part displays the posts */}
                                <Card key={index}>
                                    <Card.Header>{item.title}</Card.Header>
                                    <Card.Body>
                                        <blockquote className="blockquote mb-0">
                                            <p>{' '}{item.content}{' '}</p>
                                            <footer className="blockquote-footer">
                                                By {item.firstname} {item.lastname}: <cite title="Source Title">@{item.username}</cite>
                                            </footer>
                                        </blockquote>
                                    </Card.Body>
                                </Card>
                                {/* This is the part which allows the user to edit their post*/}
                                {(userid.id === item.userid) && <Button style={{ cursor: 'pointer' }} variant='primary' onClick={() => {
                                    setToggleEditPost(!toggleEditPost);
                                    setEditPostData({ id: item._id, title: item.title, content: item.content });
                                }}>Edit post</Button>}
                                {/* This part allows user to delete the post */}
                                {(userid.id === item.userid) &&
                                    <>
                                        <Button style={{ cursor: 'pointer' }} variant="warning" onClick={() => { setEditPostData({ id: item._id }); setShow(true) }}>
                                            Delete post
                                        </Button>

                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header>
                                                <Modal.Title>Delete this post</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
                                            <Modal.Footer>
                                                <Button style={{ cursor: 'pointer' }} onClick={handleClose}>
                                                    Cancel
                                                </Button>
                                                <Button style={{ cursor: 'pointer' }} variant="danger" onClick={() => handleDelete(editPostData.id)}>
                                                    Delete this post
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </>}
                                <br></br>
                            </>
                        )
                    })}
                    {(data && data.length === 0) && <><br></br><Row><p>You have no posts to display</p></Row></>}
                    <br></br>
                </Col>
            </Row>
        </Container >

    )
}
