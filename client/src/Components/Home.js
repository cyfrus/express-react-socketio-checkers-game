import React from "react";
import {Link} from "react-router-dom";


const Home = () => (
      <div>
        <ul className="list_menu">
          <li>
            <Link to="/search">New Game</Link>
          </li>
          <li>
            <Link to="/tournaments">Tournaments</Link>
          </li>
          <li>
            <Link to="/rules">Rules</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            
          </li>
        </ul>
      </div>
);





export default Home;
