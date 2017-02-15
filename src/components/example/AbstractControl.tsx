import * as React from 'react';
import * as _ from 'lodash';

export const DEFAULT_DEBOUNCE_TIMEOUT = 400;

export interface IAbstractControlState {
  valid?: boolean;
  focus?: boolean;
  touch?: boolean;
  dirty?: boolean;
  enable?: boolean;
  loading?: boolean; 
  controls?: any;
  value: any;
  
}

interface IAbstractControlValidatorSync {
  (f: AbstractControl): boolean;
}

interface IAbstractControlValidatorAsync {
  (f: AbstractControl): Promise<Boolean>;
}


export interface IAbstractControlProps {
  name: string;
  label?: string;
  type?: 'text' | 'password';
  placeholder?: string;
  focusPlaceholder?: string;
  icon?: string;
  value?: string;
  debounce?: number;
  valueToDisplay?: (value) => string;
  validators?: Array<IAbstractControlValidatorSync>;
  validatorsAsync?: Array<IAbstractControlValidatorAsync>;
  onChange?: (state: IAbstractControlState, name: string) => boolean;
  onBlur?: (event: any) => boolean;
  onFocus?: (event: any) => boolean;
}

export default class AbstractControl extends React.Component<IAbstractControlProps, IAbstractControlState> {
  constructor(props: IAbstractControlProps, context) {
    super(props, context);
  }

  /**
   * get placeholder or focus placeholder
   */
  get placeholder(): string {
    if (this.state && this.state.focus && this.props.focusPlaceholder) {
      return this.props.focusPlaceholder;
    }
    return this.props.placeholder;
  }

  /**
   * get debounce timeout if not defined returns DEFAULT_DEBOUNCE_TIMEOUT
   */
  get debounce() {
    return this.props.debounce || DEFAULT_DEBOUNCE_TIMEOUT;
  }

  // helper function to reduce and array of booleans
  reduceBooleanArray(arr: Array<boolean>) {
    return arr.reduce((acc, item) => {
      return acc && item;
    }, true);
  }

  get validators() {
    return this.props.validators || []
  }

  get validatorsAsync() {
    return this.props.validatorsAsync || []
  }

  get label() {
    return this.props.label ? this.props.label : this.props.name;
  }

  /**
   * Get value to be displayed.
   * If valueToDisplay function is defined it will return the result of it execution.
   */
  get displayValue(): string {
    if(this.props.valueToDisplay) {
      return this.props.valueToDisplay(this.state.value)
    }
    return this.state.value
  }

 /**
 * Execute onChange to notify parent of a state change
 */
  notifyParent() {
    if(this.props.onChange) {
      this.props.onChange(this.state, this.props.name);
    } 
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
 * 
 */
  validateAsync(): Promise<boolean> {
    let _arr = [];
    _arr = this.props.validatorsAsync.map((val) => val.call(this, this))

    return Promise.all(_arr).then((arr) => {
      return this.reduceBooleanArray(arr);
    })
    .catch((error) => {
      console.error(error);
      return false;
    })
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

  get loading() {
    return this.state.loading;
  }

  componentDidMount() {
    this.notifyParent();
  }

  render() {
    return (<h1>Render not implemented</h1>);
  }

}

