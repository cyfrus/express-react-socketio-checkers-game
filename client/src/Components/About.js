import React from "react";

class About extends React.Component {
  render() {
    return (
      <div className="aboutDiv row">
      <div className="col-md-8 offset-md-2">
        <p>
          Project created for purpose of submitting final project for bachelor's degree. Project was created with numerous technologies. The major ones are Node.js, Express.js for back-end API. Socket.IO for real time communication between clients. On the front end i used React.JS with React Router.
        </p>
        <p>
          I put lot of time effort and commitment to this college and I was not alone on that journey. Many people have helped me and for that thank you all.
        </p>

        <div>
          Special thanks to my mentor Toma Roncevic, my familiy who provided me with immense amount of support and love. And to my colleagues: 
          <ul className="thanksList">
            <li>Ante Vuletic</li>
            <li>Ante Danicic</li>
            <li>Dario Dzale</li>
            <li>Gorana Basic</li>
            <li>Marko Novosel</li>
            <li>Marko Marin</li>
          </ul>

          And many more. Thank you all.

          <span>Davor Midenjak</span>
        </div>
        </div>
      </div>
    );
  }
}

export default About;
