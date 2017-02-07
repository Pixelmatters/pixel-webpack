import * as React from 'react';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
import FormControl from './FormControl';


export  default class ExamplePage extends React.Component<any, any> {

    constructor(props, context) {
        super(props, context);
    }

    formatValue(value: string) {
      return `## ${value} ##`;
    }

    validateRegExp(form: FormControl) {
      const _res = form.state.value.match(/abc/);

      return _res !== null && _res.length !==0
    }

    validateAsyncTrue(form: FormControl) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        },500)
      })
    }

    validateAsyncFalse(form: FormControl) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        },500)
      })
    }

    render () {
        return (
            
            <div>
              <h1>Form Example Page</h1>
              <FormControl 
                name="test" 
                placeholder="Some placeholder" 
                focusPlaceholder="another placeholder"
                validators={[this.validateRegExp]}
                validatorsAsync={[this.validateAsyncTrue, this.validateAsyncFalse]}
                ></FormControl>
            </div>
        );
    }
}
