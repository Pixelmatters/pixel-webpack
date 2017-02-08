import * as React from 'react';
import AbstractControl from './AbstractControl';
import * as _ from 'lodash';

export interface IFormControlState {
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

  validateDebounce: Function;

  constructor(props: IFormControlProps, context) {
    super(props, context);

    // set initial state
    this.state = {
      valid: true,
      focus: false,
      touch: false,
      dirty: false,
      enable: true,
      loading: false,
      value: ''
    }

    // debounce validate function
    this.validateDebounce =
     _.debounce(() => {
      this.validate();
      }, this.debounce); 
    
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



// FormGroup

// { valid: false
//   name: value
//   name: value
//   name : {
//     valid: false
//     firtName: {value, valid false, dirty}
//     lastNAme: value
//   }
// }



/*AbstractControl

  name: string;
  type?: InputType;
  
  errors?: Array<string>;
  
  value?: any;
  valueToDisplay?: string;

  placeholders?: Array<string>;
  focusPlaceholder?: string;
  
  debounce?: number; //input change

  editable?: boolean; //enable | disable
  icon?: InputIcon;
  
  pickerValues?: Array<any>; // Select

  passwordStrength?: number;
  rightButton?: IFormInputRightButton;
  async?: IFormInputAsync; Function(f: FormControl) return promise // usar o debound do input
  validations?: Array<IFormInputValidation>;  Function(f: FormControl)
  returnKeyType?: Function;

  // set on <form> and <formInput> components
  formName: string;
  inputValue?: any;
  bottomBorder?: boolean;
  rightButtonAction?: Function;
  onSubmitEditing?: Function;
  onFocus?: Function;
  onBlur?: Function;
  dispatch?: Function;


FormControl

  InputText
  InputPassword
  InputSelect
  InputDate
  InputRigthButton

FormGroup
  
  valid
  icon
  touched
  dirty

  Inputs: Array<AbstractControl>
  validations Function(g: FormGroup)
  async validations ???????*/
