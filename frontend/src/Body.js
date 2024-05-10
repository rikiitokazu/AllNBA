import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://localhost:5000/";

const Body = () => {
  const [stat, setStat] = React.useState(null);
  const [responseData, setResponseData] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${baseUrl}`, {
        data: inputValue,
      });
      setResponseData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getName = async () => {
    try {
      const response = await axios.post(`${baseUrl}/name`, {
        pname: inputValue,
      });
      setUsername(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios.get(`${baseUrl}/events`).then((response) => {
      setStat(response.data);
    });
  }, []);
  const list = [
    "PTS",
    "PF",
    "TOV",
    "BLK",
    "STL",
    "AST",
    "REB",
    "DREB",
    "OREB",
    "FT_PCT",
    "FTA",
    "FTM",
    "FG3_PCT",
    "FG3A",
    "FG3M",
    "FG_PCT",
    "FGA",
    "FGM",
    "MIN",
    "GS",
    "GP",
    "Team_ID",
    "LEAGUE_ID",
    "PLAYER_ID",
  ];

  if (!stat) return null;
  return (
    <div>
      <div className="container-xxl justify-content-center my-4 ">
        <section className="display-5 text-center">
          Type your favorite players name to see their stats
        </section>
        <p className="lead text-center">Using the NBA Python API</p>
      </div>
      <div className="container-lg align-items-center">
        <div className = "text-center">
          <input
            onChange={handleChange}
            type="text"
            placeholder="Player Name"
            value={inputValue}
          />
          <button className = "btn btn-primary ms-3 text-center"
            onClick={(event) => {
              handleSubmit();
              getName();
            }}
          >
            Submit
          </button>
          <h2>{username}</h2>
          {responseData && (
            <div>
              {" "}
              {responseData.rowSet[0]
                .slice(0)
                .reverse()
                .map((stats, index) => {
                  return (
                    <h5 className = "text-center align-items-start" key={index}>
                      {list[index]}: {stats}
                    </h5>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
