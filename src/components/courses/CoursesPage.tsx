import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseList from './CourseList';

interface ICoursesPageProps {
    actions: any;
    courses: Array<any>;
};


class CoursesPage extends React.Component<ICoursesPageProps, any> {


    constructor(props, context) {
        super(props, context);
    }

    courseRow(course, index) {
        return (
            <div key={index}>{course.title}</div>
        );
    }

    render () {
        const {courses} = this.props;
        return (
            <div>
                <h1>Courses</h1>
                <CourseList courses={courses} />
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        courses: state.courses
    };
};

const mapDispatchToProps = (dispatch) => {
  
    return {
        actions: bindActionCreators(courseActions.createCourse, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);


 
