 import {createStore, applyMiddleware} from 'redux';
 import rootReducer from '../reducers';
 import * as reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
 import thunk from 'redux-thunk';

 const configureStore = (initalState?) => {
     return createStore(
         rootReducer, 
         initalState,
         applyMiddleware(thunk, reduxImmutableStateInvariant())
    );
 };

 export default configureStore;