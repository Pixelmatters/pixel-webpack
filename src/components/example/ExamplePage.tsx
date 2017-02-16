import * as React from 'react';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
// import FormControl from 'src/components/example/FormControl';
import FormControl from 'components/example/FormControl';
import FormGroup from './FormGroup';
import FormArray from './FormArray';


export default class ExamplePage extends React.Component<any, any> {

  arr: Array<number>

  constructor(props, context) {
    super(props, context);
    this.state = {
      arr : [0, 1]
    }
  }

  formatValue(value: string) {
    return `## ${value} ##`;
  }

  validateRegExp(form: FormControl) {
    const _res = form.state.value.match(/abc/);

    return _res !== null && _res.length !== 0
  }

  validateAsyncTrue(form: FormControl) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  }

  validateAsyncFalse(form: FormControl) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  }

  add() {
    this.setState({ arr : [...this.state.arr, this.state.arr.length]})
    console.log(this.state.arr)
    this.forceUpdate();
  }

  myArray() {
    return this.state.arr;
  }

  render() {
    console.log('Render')
    return (

      <div>
        <button onClick={this.add.bind(this)}>add</button>
        <h1>Form Example Page</h1>
        <FormGroup name="login">
          <FormControl
            name="firstName"
            placeholder="Some placeholder"
            focusPlaceholder="another placeholder"
            validators={[this.validateRegExp]}
            validatorsAsync={[this.validateAsyncTrue, this.validateAsyncFalse]}
          ></FormControl>

          <FormArray name="todos">
            {this.state.arr.map((item) => {
              return (
                <div className="row" key={item}>
                  <FormGroup name={'subform' + item}>
                    <div className="col-lg-6">
                      <FormControl
                        name="subFirstName"
                        placeholder="Some placeholder"
                        focusPlaceholder="another placeholder"
                        validators={[this.validateRegExp]}
                        validatorsAsync={[this.validateAsyncTrue, this.validateAsyncFalse]}
                      ></FormControl>
                    </div>

                    <div className="col-lg-6">
                      <FormControl
                        name="subLastName"
                        placeholder="Some placeholder"
                        focusPlaceholder="another placeholder"
                        validators={[this.validateRegExp]}
                        validatorsAsync={[this.validateAsyncTrue, this.validateAsyncFalse]}
                      ></FormControl>
                    </div>
                  </FormGroup>
                </div>
              )
            })}
          </FormArray>
        </FormGroup>
      </div>
    );
  }
}
