import * as types from './actionsTypes';
import courseApi from '../api/mockCourseApi';

export const createCourse = (course) => {
    return {
        type: types.CREATE_COURSE,
        course: course
    };
};

export const updateCourseSuccess = (course) => {
    return {
        type: types.UPDATE_COURSE_SUCCESS,
        course: course
    };
};

export const createCourseSuccess = (course) => {
    return {
        type: types.CREATE_COURSE_SUCCESS,
        course: course
    };
};


export const loadCoursesSuccess = (courses) => {
    return {
        type: types.LOAD_COURSES_SUCCESS,
        courses: courses
    };
};


export const loadCourses = () => {
    return function(dispatch, getState) {
        return courseApi.getAllCourses()
            .then((courses) => {
                dispatch(loadCoursesSuccess(courses));
            })
            .catch(error => {
                throw(error);
            });
    };
};

export const saveCourses = (course) => {
    return function(dispatch) {
        return courseApi.saveCourses(course)
            .then((savedCourse) => {
                course.id ? dispatch(updateCoursesSuccess(savedCourse)) :
                    dispatch(createCoursesSuccess(savedCourse));
            })
            .catch(error => {
                throw(error);
            });
    };
};