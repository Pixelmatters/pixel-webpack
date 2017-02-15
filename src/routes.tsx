import * as React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import CoursesPage from './components/courses/CoursesPage';
import ManageCoursePage from './components/courses/ManageCoursePage';
import ExamplePage from './components/example/ExamplePage';
export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="about" component={AboutPage} />
        <Route path="example" component={ExamplePage} />
        <Route path="course/:id" component={ManageCoursePage} /> 
        <Route path="courses" component={CoursesPage} />
    </Route>
);