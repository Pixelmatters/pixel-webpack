import * as React from 'react';
import AbstractControl from './AbstractControl';
import * as _ from 'lodash';

export interface IFormGroupState {
  name: string;
  valid?: boolean;
  focus?: boolean;
  touch?: boolean;
  dirty?: boolean;
  enable?: boolean;
  loading?: boolean;
  value: any;
  controls: any;
}


interface IFormGroupValidatorSync {
  (g: FormGroup): boolean;
}

export interface IFormGroupProps {
  name: string;
  legend?: string;
  value?: string;
  debounce?: number;
  validators?: Array<IFormGroupValidatorSync>;
  onChange?: (state: IFormGroupState, name: string) => boolean;
  onBlur?: (event: any) => boolean;
  onFocus?: (event: any) => boolean;
}

export default class FormGroup extends AbstractControl {

  childrenWithProps: any;


  constructor(props: IFormGroupProps, context) {
    super(props, context);

    // set inital state
    this.state = {
      name: this.props.name,
      valid: true,
      focus: false,
      touch: false,
      dirty: false,
      enable: true,
      loading: false,
      value: {},
      controls: {}
    }

    // debounce validate function
    this.validateDebounce =
      _.debounce(() => {
        this.validate();
      }, this.debounce);
  }

  /**
   * Validate formGroup sync validators.
   * if valid, validate child controls valid state.
   * setState and notify parent.
   */
  validate() {
    let validSync = this.validateSync();
    if (validSync) {
      let _arr = [];
      // get all valid state from the child controls
      for (let key of Object.keys(this.state.controls)) {
        _arr.push(this.state.controls[key].valid);
      }
      //reduce the array of the child valid state controls
      validSync = this.reduceBooleanArray(_arr)
    }
    this.setState({ valid: validSync }, () => this.notifyParent());
  }

  // helper function to get values from the controls
  
  componentDidMount() {

    let _state = this.state || {
      name: this.props.name,
      valid: true,
      focus: false,
      touch: false,
      dirty: false,
      enable: true,
      loading: false,
      controls: {},
      value: {}
    };

    this.childrenWithProps = this.recursiveCloneChildren(this.props.children, _state, 'FormGroup');
    this.setState(_state, () => this.notifyParent());
    
  }

  render() {
    return (
      <div
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
      >
        <hr />
        {this.childrenWithProps}
        <hr />
      </div>
    )
  }
}
