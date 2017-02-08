import * as React from 'react';
import * as _ from 'lodash';

const DEFAULT_DEBOUNCE_TIMEOUT = 400;

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

export default class FormGroup extends React.Component<IFormGroupProps, IFormGroupState> {

  childrenWithProps: any;
  validateDebounce: Function;

  constructor(props: IFormGroupProps, context) {
    super(props, context);

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

    this.validateDebounce =
     _.debounce(() => {
      this.validate();
      }, this.debounce); 
  }

  get debounce() {
    return this.props.debounce || DEFAULT_DEBOUNCE_TIMEOUT;
  }

  reduceBooleanArray(arr: Array<boolean>) {
    return arr.reduce((acc, item) => {
      return acc && item;
    }, true);
  }

  get validators() {
    return this.props.validators || []
  }

/**
 * Validate formGroup sync validators.
 * if valid, validate child controls valid state.
 * setState and notify parent.
 */
  validate() {
    let validSync = this.validateSync();
    if(validSync) {
      let _arr = [];
      // get all valid state from the child controls
      for(let key of Object.keys(this.state.controls)) {
        _arr.push(this.state.controls[key].valid);
      }
      //reduce the array of the child valid state controls
      validSync = this.reduceBooleanArray(_arr)
    }
    this.setState({valid: validSync}, () => this.notifyParent());
  }

/**
 * Execute all sync validation on the validators props
 */
  validateSync(): boolean {
    return this.validators.reduce((acc, validator) => {
      return acc && validator.call(this, this);
    }, true);
  }

/**
 * Execute onChange to notify parent of a state change
 */
  notifyParent() {
    if(this.props.onChange) {
      this.props.onChange(this.state, this.props.name);
    } 
  }

getValue(controls) {
  let _value = {}
  for(let key of Object.keys(controls)) {
    _value[key] = controls[key].value ? controls[key].value : ''
  }
  return _value;
}

/**
 * Change the state and notify the parent
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
      },() => {
      this.validateDebounce();
      this.notifyParent();
    }) ;
  }

  /**
   * Change focus state and touch state
   */
  onFocus(event) {
    if(this.props.onFocus) {
      this.props.onFocus(event);
    } 
    this.setState({focus: true}, ()=> this.notifyParent());
    if(!this.state.touch) {
      this.setState({touch: true}, ()=> this.notifyParent());
    }
  }

/**
 * Change focus state
 */
  onBlur(event) {
    if(this.props.onBlur) {
      this.props.onBlur(event);
    } 
    this.setState({focus: false}, ()=> this.notifyParent())
  }

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

      if(child.type.name === 'FormGroup') {
        state['controls'] = {};
      }

      _state = {
          ..._state,
          controls: {
            ..._state.controls, 
            [child.props.name]: state
          }
        };

      return React.cloneElement(child, {
        onChange: this.onChange.bind(this)
      })
    })

    this.setState(_state, ()=> this.notifyParent());
  }

  render() {
    
    return (
      <div
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
      >
        <hr/>
        {this.childrenWithProps}
        <hr/>
      </div>
    )
  }
}
