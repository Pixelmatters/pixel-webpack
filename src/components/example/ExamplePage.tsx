import * as React from 'react';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
// import FormControl from 'src/components/example/FormControl';
import FormControl from 'components/example/FormControl';
import FormGroup from './FormGroup';


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
              <FormGroup name="login">
                <FormControl 
                  name="firstName" 
                  placeholder="Some placeholder" 
                  focusPlaceholder="another placeholder"
                  validators={[this.validateRegExp]}
                  validatorsAsync={[this.validateAsyncTrue, this.validateAsyncFalse]}
                  ></FormControl>
                  <FormControl 
                    name="LastName" 
                    placeholder="Some placeholder" 
                    focusPlaceholder="another placeholder"
                    validators={[this.validateRegExp]}
                    validatorsAsync={[this.validateAsyncTrue, this.validateAsyncFalse]}
                    ></FormControl>
                  {/*<div>
                    <h1>Other element</h1>
                    
                  </div>*/}
                  
                <FormGroup name="sublogin">
                  <div><div>
                  <FormControl 
                    name="subFirstName" 
                    placeholder="Some placeholder" 
                    focusPlaceholder="another placeholder"
                    validators={[this.validateRegExp]}
                    validatorsAsync={[this.validateAsyncTrue, this.validateAsyncFalse]}
                    ></FormControl>
                    
                    <FormControl 
                    name="subLastName" 
                    placeholder="Some placeholder" 
                    focusPlaceholder="another placeholder"
                    validators={[this.validateRegExp]}
                    validatorsAsync={[this.validateAsyncTrue, this.validateAsyncFalse]}
                    ></FormControl>
                  </div></div>
                  </FormGroup>
              </FormGroup>
            </div>
        );
    }
}
