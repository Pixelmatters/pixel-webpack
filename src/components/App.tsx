import * as React from 'react';
import Header from './common/Header';

interface IAppProps {
  children: Object;
}

class App extends React.Component<IAppProps, null> {
    render () {
        return (
            <div className="container-fluid">
                <Header/>
                {this.props.children}
            </div>
        );
    }
}

export default App;
 
