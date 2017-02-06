import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';

interface ICourse {
  id: string;
  title: string;
  watchHref: string;
  authorId: string;
  length: string;
  category: string;
}

interface IAuthor {
  id: string;
  firstName: string;
  lastName: string;
}


interface IProps {
    course: ICourse;
    authors: Array<IAuthor>;
    actions: any;
};

interface IState {
  course: ICourse;
  errors: any;
}


class ManageCoursePage extends React.Component<IProps, IState> {

    constructor(props, context) {
        super(props, context);

        this.state = {
            course: Object.assign({}, props.course),
            errors: {}
        };

        this.updateCourseState = this.updateCourseState.bind(this);
    }

    updateCourseState(event) {
        const field = event.target.name;
        let course = this.state.course;
        course[field] = event.target.value;
        return this.setState({course: course});
    }

    render () {
        return (
            
            <CourseForm 
                allAuthors = {this.props.authors}
                course={this.state.course}
                errors={this.state.errors}
                onChange={this.updateCourseState}
            />
            
        );
    }
}

 

const mapStateToProps = (state, ownProps) => {
    let course: ICourse = {id: '', watchHref: '', title: '', authorId: '', length: '', category: ''};
    return {
        course: course,
        authors: state.authors.map(author => ({value: author.id, text: author.firstName + ' ' + author.lastName}))
    } as IProps; 
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({...courseActions}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);