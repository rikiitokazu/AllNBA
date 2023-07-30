import basketball from "./assets/basketball.jpg";
import playerstats from "./assets/playerstats.PNG";
import shotchart from "./assets/playershotchart.PNG";
import teamstats from "./assets/teamstats.PNG";
import community from "./assets/community.PNG"; 

import { Link } from "react-router-dom";

const Front = () => {
  return (
    <div>
      <div className="bg-warning border border-dark border-1 bg-opacity-10 p-5">
        <div className="container-flex">
          <div className="row">
            <div className="col-4">
              <img
                src={basketball}
                alt="basketball"
                width="500"
                height="500"
                className="border border-dark border-5 img-thumbnail"
              />
            </div>
            <div className="col-8 text-center">
              <div className="ms-5 me-5">
                <h1 className="display-1 p-3">
                  <strong>NBA-All</strong>
                </h1>
                <small>
                  <strong>
                    Featuring player/team stats and a community dedicated
                    towards publicizing NBA opinions
                  </strong>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-warning bg-opacity-10 p-4 border border-dark border-1 ">
        <section>
          <h1 className="display-5 p-3 text-center">
            <strong>See what NBA-All has to offer</strong>
          </h1>
        </section>

      <div className="container-flex p-3">
        <div className="row gy-4 justify-content-center d-md-flex">
          <div className="col-md-4 me-sm-5">
            <div className="card h-100 border border-secondary">
              <img src={community} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">
                  <strong>Community</strong>
                </h5>
                <p className="card-text">
                  See the latest basketball opinions. <a href="/login">Login</a>{" "}
                  to create your own.
                </p>
                <Link to="/game" className="btn btn-primary">
                  Explore
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-2 ms-sm-4">
            <div className="card h-100 border border-secondary">
              <img src= {playerstats} className="card-img-top mb-3" alt="..." />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title"><strong>Player Stats</strong></h5>
                <p className="card-text">
                  Search any player up to see their all-time stats
                </p>
                <Link to="/playerhistory" className="btn btn-primary mt-auto">
                  Search
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="card h-100 border border-secondary">
              <img src= {shotchart} className="card-img-top" alt="..." />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title"><strong>Shot Charts</strong></h5>
                <p className="card-text">
                  Look up any player's active shot-chart for a season and their
                  percentages
                </p>
                <Link to ="/morestats" className="btn btn-primary mt-auto">
                  Search
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="card h-100 border border-secondary">
              <img src= {teamstats} className="card-img-top mb-2" alt="..." />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title"><strong>Team Info</strong></h5>
                <p className="card-text">
                  Learn more about all 30 nba teams and their current records
                </p>
                <Link to ="/teaminfo" className="btn btn-primary mt-auto">
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
  );
};

export default Front;
