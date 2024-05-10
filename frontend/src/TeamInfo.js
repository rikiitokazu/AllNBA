import React, { useState } from "react";
import axios from "axios";

const TeamName = [
  "Atlanta Hawks",
  "Boston Celtics",
  "Cleveland Cavaliers",
  "New Orleans Pelicans",
  "Chicago Bulls",
  "Dallas Mavericks",
  "Denver Nuggets",
  "Golden State Warriors",
  "Houston Rockets",
  "Los Angeles Clippers",
  "Los Angeles Lakers",
  "Miami Heat",
  "Milwaukee Bucks",
  "Minnesota Timberwolves",
  "Brooklyn Nets",
  "New York Knicks",
  "Orlando Magic",
  "Indiana Pacers",
  "Philadelphia 76ers",
  "Phoenix Suns",
  "Portland Trail Blazers",
  "Sacramento Kings",
  "San Antonio Spurs",
  "Oklahoma City Thunder",
  "Toronto Raptors",
  "Utah Jazz",
  "Memphis Grizzlies",
  "Washington Wizards",
  "Detroit Pistons",
  "Charlotte Hornets",
];
const franchiseLabels = ["Points", "Assists", "Rebounds", "Blocks", "Steals"];
const baseUrl = "http://localhost:5000/";

const TeamInfo = () => {
  const [selected, setSelected] = useState("");
  const [teaminfo, setTeamInfo] = useState("");
  const [roster, setRoster] = useState([]);
  const [franchise, setFranchise] = useState([]);

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  const getInfo = async () => {
    try {
      const response = await axios.post(`${baseUrl}/teaminfo`, {
        teaminformation: selected,
      });
      setTeamInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRoster = async () => {
    try {
      const response = await axios.post(`${baseUrl}/teamroster`, {
        teamrostername: selected,
      });
      setRoster(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFranchise = async () => {
    try {
      const response = await axios.post(`${baseUrl}/teamfranchises`, {
        teamfranchiserecord: selected,
      });
      setFranchise(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <section className="display-5 text-secondary text-center mt-3">
        See Each Team's Record
      </section>
      <div>
        {/*if selected isn't '' do the function */}
        <section className="text-center">
          <select
            value={selected}
            onChange={handleChange}
            onClick={(event) => {
              getInfo();
              getRoster();
              getFranchise();
            }}
          >
            <option value={selected}>Select an option</option>
            {TeamName.map((team, index) => (
              <option key={index} value={team}>
                {team}
              </option>
            ))}
          </select>
          {/* conditional rendering, find out how to do loading if its 
            rendering*/}
          {teaminfo && (
            <section>
              <h2>{teaminfo.SEASON_YEAR}</h2>
              <h3>
                {teaminfo.TEAM_CITY} {teaminfo.TEAM_NAME} <br />
                Conference: {teaminfo.TEAM_CONFERENCE} Rank:{" "}
                {teaminfo.CONF_RANK}
                <br />
                Division: {teaminfo.TEAM_DIVISION} Rank: {teaminfo.DIV_RANK}{" "}
              </h3>
              <h3>
                Record: {teaminfo.W}/{teaminfo.L}
                <span> {teaminfo.PCT}</span>
              </h3>
            </section>
          )}
        </section>
        {roster.dataroster && (
          <div className="d-flex justify-content-center">
            <table>
              <thead>
                <tr>
                  <th>PLAYER</th>
                  <th>NUM</th>
                  <th>POSITION</th>
                  <th>HEIGHT</th>
                  <th>WEIGHT</th>
                  <th>BIRTH_DATE</th>
                  <th>AGE</th>
                  <th>SCHOOL</th>
                  <th>HOW_ACQUIRED</th>
                </tr>
              </thead>
              <tbody>
                {roster.dataroster?.map((row, index) => (
                  <tr key={index}>
                    <td>{row.PLAYER}</td>
                    <td>{row.NUM}</td>
                    <td>{row.POSITION}</td>
                    <td>{row.HEIGHT}</td>
                    <td>{row.WEIGHT}</td>
                    <td>{row.BIRTH_DATE}</td>
                    <td>{row.AGE}</td>
                    <td>{row.SCHOOL}</td>
                    <td>{row.HOW_ACQUIRED}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {franchise.tea && (
          <div>
            <br />
            <h1 className = "ms-4">Franchise Leaders:</h1>
            <div className="d-flex flex-row justify-content-center">
            {franchise.tea?.map((name, index) => (
              <div className="d-flex flex-row">
                <div className = "p-2 m-3" key={index}>
                    <h2>{franchiseLabels[index]} </h2>{name}
                </div>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamInfo;
