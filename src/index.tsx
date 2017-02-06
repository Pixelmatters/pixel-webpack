import 'babel-polyfill';
import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import * as courseActions from './actions/courseActions';
import * as authorActions from './actions/authorActions';
import configureStore from './store/configureStore';

const store = configureStore();
store.dispatch(courseActions.loadCourses());
store.dispatch(authorActions.loadAuthors());

// import './styles.scss';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

render(
    <Provider store= {store}>
        <Router history={browserHistory} routes={routes} />
    </Provider>,
    document.getElementById('app')
);