import * as React from 'react';
import {Link} from 'react-router';

class HomePage extends React.Component<any, any> {
    render () {
        return (
            <div className="jumbotron">
                <h1> Pluralsight Administration</h1>
                <p>React, Redux and React Router in ES6 for ultr-responsive web apps.</p>
                <Link to="about" className="btn btn-primate btn-lg">Learn more</Link>
            </div>
        );
    }
}

export default HomePage;
 
