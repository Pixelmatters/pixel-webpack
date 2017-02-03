import AuthorApi from '../api/mockAuthorApi';
import * as types from './actionsTypes';

export const loadAuthorsSuccess = (authors) => {
    return {type: types.LOAD_AUTHORS_SUCCESS, authors: authors};
};

export const loadAuthors = () => {
    return dispatch => {
        return AuthorApi.getAllAuthors()
        .then(authors => {
            dispatch(loadAuthorsSuccess(authors));
        })
        .catch(error => {
            throw error;
        });
    };
};