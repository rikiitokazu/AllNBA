import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const baseUrl = "http://localhost:5000/";

const Game = () => {
  const [user, setUser] = useState(null);
  const [userpost, setUserPost] = useState("");
  const [allPost, setAllPost] = useState("");
  const [upvote, setUpvote] = useState(null); ////???? how to make process faster
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${baseUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.name);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const handleChange = (e) => {
    setUserPost(e.target.value);
  };

  const handlePost = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
      }; //do i need the quotes around authorization
      const response = await axios.post(
        `${baseUrl}/posting`,
        { newpost: userpost },
        { headers }
      );
    } catch (error) {
      console.log(error);
    }
    getPosts();
  };

  useEffect(() => {
    getPosts();
  }, []);
  const getPosts = async () => {
    axios
      .get(`${baseUrl}/posting`)
      .then((response) => {
        setAllPost(response.data);
        console.log(typeof response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteBody = async (postid) => {
    try {
      const response = await axios.delete(`${baseUrl}/managepost/${postid}`);
      const newposts = allPost.filter((post) => post.post_id != postid);
      setAllPost(newposts);
      getPosts();
    } catch (error) {
      console.log(error);
    }
  };
  const getvote = async (upvotes, id, method) => {
    if (method === "up") {
      try {
        const response = await axios.post(`${baseUrl}/upvote`, {
          addone: upvotes,
          id: id,
        });
        setUpvote(response.data);
        getPosts();
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await axios.post(`${baseUrl}/downvote`, {
          removeone: upvotes,
          id: id,
        });
        setUpvote(response.data);
        getPosts();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <section className="text-center display-5 m-4">
        Anonymous NBA posts
      </section>
      {user ? (
        <p className="lead text-center text-muted mb-4">User: {user}</p>
      ) : (
        <div></div>
      )}
      {user ? (
        <section className="d-flex justify-content-center">
          <button onClick={showModal} className="btn btn-primary b-5 ms-3 mb-2">
            Start Writing
          </button>
          <Modal show={isOpen} onHide={hideModal}>
            <Modal.Header>
              <Modal.Title>Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <textarea
                onChange={handleChange}
                type="text"
                placeholder="Write Post"
                value={userpost}
                name="paragraph_text"
                cols="50"
                rows="10"
              ></textarea>
            </Modal.Body>
            <Modal.Footer>
              <button className = "btn btn-primary" onClick={hideModal}>Cancel</button>
              <button
                className="btn btn-primary ms-3"
                type="submit"
                onClick={(event) => {
                  handlePost();
                  setUserPost("");
                  hideModal();
                }}
              >
                Post
              </button>
            </Modal.Footer>
          </Modal>
        </section>
      ) : (
        <h1 className="text-center">
          <Link to="/login">Login</Link> to Create a Post
        </h1>
      )}
      <div>
        {Object.entries(allPost).map(([key, value]) => {
          return (
            <section className="container" key={value.post_id}>
              <div className="row mt-1 justify-content-center align-items-center ms-5 border border-secondary border-3 me-5 bg-secondary bg-opacity-10">
                <div className="col-6 ms-5">{value.body}</div>
                <div className="col-2">
                  <button
                    className="btn btn-secondary"
                    type="submit"
                    onClick={() => getvote(value.upvote, value.post_id, "up")}
                  >
                    {value.upvote}
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="submit"
                    onClick={() =>
                      getvote(value.downvote, value.post_id, "down")
                    }
                  >
                    {value.downvote}
                  </button>
                </div>
                <div className="col-3 justify-content-end text-end">
                  {user === value.user_id ? (
                    <button
                      type="submit"
                      onClick={() => deleteBody(value.post_id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
                <div className="col-2"></div>
                {value.date}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Game;
