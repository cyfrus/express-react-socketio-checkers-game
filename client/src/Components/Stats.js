import React from "react";
import axios from "axios";

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: null,
        }
    }
    componentDidMount() {
        axios.get('/stats')
        .then((response) => {
            // handle success
            this.setState({
                stats: response.data
            })
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    }
    render() {
        if(this.state.stats) {
            var tableInformations = this.state.stats.map((element) => {
                return <tr>
                            <td>{element.game_ID}</td>
                            <td>{element.username}</td>
                            <td>{element.MMR}</td>
                            <td>{element.status}</td>
                        </tr>;
            });
        }
        return (
            <div className="row">
                <div className="col-md-12">
                    <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Match ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">MMR</th>
                        <th scope="col">Game status</th>
                        </tr>
                    </thead>
                        <tbody>
                        {tableInformations}
                        </tbody>
                        
                   
                    </table>
                </div>
            </div>
        )
    };
}

export default Stats;