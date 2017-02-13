import * as React from 'react';
import AbstractControl from './AbstractControl';
import * as _ from 'lodash';

export interface IFormGroupState {
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
  validateDebounce: Function;

  constructor(props: IFormGroupProps, context) {
    super(props, context);

    // set inital state
    this.state = {
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
  private getValue(controls) {
    let _value = {}
    for (let key of Object.keys(controls)) {
      _value[key] = controls[key].value ? controls[key].value : ''
    }
    return _value;
  }

  /**
   * Change the state and notify the parent
   * TODO set dirty and touch
   */
  onChange(state, name) {
    let self = this;

    this.setState(
      {
        controls: {
          ...this.state.controls,
          [name]: state
        },
        value: self.getValue(this.state.controls)
      }, () => {
        this.validateDebounce();
        this.notifyParent();
      });
  }

  /**
   * trigger child components with onChange handler
   * set state and valus for the forms group
   * notify parent
   */
  componentDidMount() {

    let _state = {
      controls: {}
    };

    this.childrenWithProps = React.Children.map(this.props.children, (child: any) => {

      let state = {
        valid: true,
        focus: false,
        touch: false,
        dirty: false,
        enable: true,
        loading: false,
        value: child.props.value || ''
      }

      if (child.type.name === 'FormGroup') {
        state['controls'] = {};
      }

      _state = {
        ..._state,
        controls: {
          ..._state.controls,
          [child.props.name]: state
        }
      };

      if(child.type.name === 'FormGroup' || child.type.name === 'FormControl' ) {
        return React.cloneElement(child, {
          onChange: this.onChange.bind(this)
        })
      } else {
        return React.cloneElement(child);
      }
        

    })

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
