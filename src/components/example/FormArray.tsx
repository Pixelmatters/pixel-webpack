import * as React from 'react';
import AbstractControl from './AbstractControl';
import * as _ from 'lodash';

export interface IFormArrayState {
  name: string;
  valid?: boolean;
  focus?: boolean;
  touch?: boolean;
  dirty?: boolean;
  enable?: boolean;
  loading?: boolean;
  value: any;
  controls: Array<AbstractControl>;
}

interface IChild {
  children: Array<any>;
  onChange: Function;
  name: string;
  value?: any;
  state: any;
}

interface IFormArrayValidatorSync {
  (a: FormArray): boolean;
}

export interface IFormArrayProps {
  name: string;
  legend?: string;
  value?: string;
  debounce?: number;
  validators?: Array<IFormArrayValidatorSync>;
  onChange?: (state: IFormArrayState, name: string) => boolean;
  onBlur?: (event: any) => boolean;
  onFocus?: (event: any) => boolean;
}

export default class FormArray extends AbstractControl {

  childrenWithProps: any;
  validateDebounce: Function;
  myRef: Array<any>;

  constructor(props: IFormArrayProps, context) {
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
      value: [],
      controls: []
    }

    this.myRef = [];

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
      // get all valid state from the child controls
      let _arr = this.state.controls.map((control) => control.valid);
      //reduce the array of the child valid state controls
      validSync = this.reduceBooleanArray(_arr)
    }
    this.setState({ valid: validSync }, () => this.notifyParent());
  }


  componentDidMount() {

    let _state = this.state || {
      name: this.props.name,
      valid: true,
      focus: false,
      touch: false,
      dirty: false,
      enable: true,
      loading: false,
      controls: [],
      value: []
    };

    this.childrenWithProps = this.recursiveCloneChildren(this.props.children, _state, 'FormArray');
    this.setState(_state, () => this.notifyParent());
    
  }

  // shouldComponentUpdate() {
  //   console.log(this.props.children);
  //   return true;
  // }

  componentWillReceiveProps(nextProps) {
    console.log('NextProps', nextProps)
    this.forceUpdate();
  }

  componentDidUpdate() {
      console.log('componentDidUpdate', this.props.array);

  //   this.childrenWithProps = this.recursiveCloneChildren(this.props.children, _state, 'FormArray');
  //   this.setState(_state, () => this.notifyParent());
    
  }


  render() {
    return (
      <div style={{'backgroundColor': 'grey'}}>
        <h1>Array</h1>
        { this.childrenWithProps }
      </div>
    )
  }
}
