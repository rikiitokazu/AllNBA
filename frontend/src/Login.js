import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://localhost:5000/";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState("");
  const [loggedin, setLoggedIn] = useState(false);
  const [getUser, setGetUser] = useState("");
  const [useritems, setUserItems] = useState(false);

  const [createemail, setCreateEmail] = useState("");
  const [createuser, setCreateUser] = useState("");
  const [createpassword, setCreatePassword] = useState("");
  const [success, setSuccess] = useState("");

  const handleUser = (e) => {
    setUsername(e.target.value);
  };
  const handlePass = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseUrl}/nbalogin`, {
        user: username,
        pass: password,
      });
      if (response.data.success) {
        localStorage.setItem("access_token", response.data.access_token);
        setLoggedIn(true);
        setError(response.data);
        getUserPosts(response.data.username);
      } else {
        setError(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/createnbalogin`, {
        newemail: createemail,
        newuser: createuser,
        newpass: createpassword,
      });
      setSuccess(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = () => {
    axios
      .post(`${baseUrl}/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        localStorage.removeItem("access_token");
        setLoggedIn(false);
        setUserItems(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserPosts = async (userid) => {
    try {
      const response = await axios.get(`${baseUrl}/getposts/${userid}`);
      setUserItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  const deletePost = async (postid) => {
    try {
      const response = await axios.delete(`${baseUrl}/managepost/${postid}`);
      const newposts = useritems.filter((post) => post.post_id != postid);
      setUserItems(newposts);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${baseUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoggedIn(true);
          setGetUser(res.data.name);
          getUserPosts(res.data.name);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div>
      <div>
        {!loggedin ? (
          <section className="text-center display-4 m-4">
            Login to write/see your posts
          </section>
        ) : (
          <section className="text-center display-5 m-5">
            Profile: {getUser}
          </section>
        )}
      </div>
      <div className="mt-5 d-flex justify-content-center align-items-center">
        <section className="text-center">
          {!loggedin ? (
            <div>
              <input
                className="m-2"
                onChange={handleUser}
                type="text"
                placeholder="Username"
                value={username}
              />
              <br />
              <input
                onChange={handlePass}
                type="text"
                placeholder="Password"
                value={password}
              />
              <br />
              <button
                className="btn btn-primary m-2"
                onClick={(event) => {
                  handleLogin();
                  setGetUser(username);
                }}
              >
                Login
              </button>
              <button>Don't have an Account?</button>
            </div>
          ) : (
            <div></div>
          )}
          {/* {errors && errors.handleerror} */}
        </section>
      </div>
      {loggedin ? <h1 className = "ms-4">See your indiviudal posts</h1>:<div></div>}
      <div>
        {Object.entries(useritems).map(([key, value]) => {
          return (
            <section key={value.post_id}>
              <div className="container">
              <div className="row mt-1 justify-content-center align-items-center ms-5 border border-secondary border-3 me-5 bg-secondary bg-opacity-10">
                <div className="col-6 ms-5">{value.body}</div>
                <div className="col-2">
                  <button className="btn btn-secondary">{value.upvote}</button>
                  <button className = "btn btn-secondary">{value.downvote}</button>
                </div>
                <div className="col-3 justify-content-end text-end">
                  <button className="btn btn-danger" onClick = {() => deletePost(value.post_id)}>Delete</button>
                </div>
                <div className="col-2"></div>{value.date}
              </div>
              </div>
            </section>
          );
        })}
      </div>
      <div>
        {loggedin ? <div>
          <section className="display-5">Personal Stats</section>
          Upvotes, Downvotes, Post
          </div>: null}
      </div>
      <h1>Create Account</h1>

      <form onSubmit={createAccount}>
        <input
          onChange={(e) => setCreateEmail(e.target.value)}
          type="text"
          placeholder="Email"
          value={createemail}
        />
        <br />
        <input
          onChange={(e) => setCreateUser(e.target.value)}
          type="text"
          placeholder="Username"
          value={createuser}
        />
        <br />
        <input
          onChange={(e) => setCreatePassword(e.target.value)}
          type="text"
          placeholder="Password"
          value={createpassword}
        />
        <button type="submit">Create</button>
      </form>
      {success && <h1>{success}</h1>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Login;
