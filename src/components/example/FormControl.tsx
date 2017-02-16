import * as React from 'react';
import AbstractControl from './AbstractControl';
import * as _ from 'lodash';

export interface IFormControlState {
  name: string;
  valid?: boolean;
  focus?: boolean;
  touch?: boolean;
  dirty?: boolean;
  enable?: boolean;
  loading?: boolean; 
  value: string;
}

interface IFormValidatorSync {
  (f: FormControl): boolean;
}

interface IFormValidatorAsync {
  (f: FormControl): Promise<Boolean>;
}

export interface IFormControlProps {
  name: string;
  label?: string;
  type?: 'text' | 'password';
  placeholder?: string;
  focusPlaceholder?: string;
  value?: string;
  debounce?: number;
  validators?: Array<IFormValidatorSync>;
  validatorsAsync?: Array<IFormValidatorAsync>;
  valueToDisplay?: (value) => string;
  onChange?: (state: IFormControlState, name: string) => boolean;
  onBlur?: (event: any) => boolean;
  onFocus?: (event: any) => boolean;
}


export default class FormControl extends AbstractControl {

  constructor(props: IFormControlProps, context) {
    super(props, context);    

    // set initial state
    this.state = {
      name: this.props.name,
      valid: true,
      focus: false,
      touch: false,
      dirty: false,
      enable: true,
      loading: false,
      value: ''
    }
    
  }

  // get wrapper class
  get wrapperClass() {
    if(this.state.valid) {
      return 'form-group'
    } else {
      return 'form-group has-error'
    }
  }

  /**
   * Change the state
   */
  onChange(event) {
    this.setState({value: event.target.value}, this.validateDebounce.bind(this));
    if (!this.state.dirty) {
      this.setState({dirty: true}, () => this.notifyParent());
    }
  }

  /**
   * validate sync validators
   * if has async validators
   * set loading to true
   * validate all async validators
   * set valid state
   * set loading to false
   */
  validate() {
    let validSync = this.validateSync();
    if(validSync && this.validatorsAsync.length > 0) {
      this.setState({loading: true}, () => this.notifyParent())
      this.validateAsync().then((validAsync) => {
        this.setState({valid: validAsync}, () => this.notifyParent());    
        this.setState({loading: false}, () => this.notifyParent())
        
      })
    } else {
      this.setState({valid: validSync}, () => this.notifyParent());    
    }
  }

  render() {
    return (
      <div className={this.wrapperClass}>
        {/*<p>###{this.state.valid.toString()} ###</p>*/}
        <label htmlFor={this.props.name}>{this.label}</label>
        <div className="field">
          <input
            type={this.props.type}
            name={this.props.name}
            className="form-control"
            placeholder={this.placeholder}
            value={this.displayValue}
            onChange={this.onChange.bind(this)} 
            onFocus={this.onFocus.bind(this)} 
            onBlur={this.onBlur.bind(this)} 
            
            />
          {/*{error && <div className="alert alert-danger">{error}</div>}*/}
          { this.loading && <i className="glyphicon glyphicon-refresh spinning"></i> }
        </div>
      </div>  
    );
  }

}