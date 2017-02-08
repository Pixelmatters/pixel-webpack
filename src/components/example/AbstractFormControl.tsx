/*import * as React from 'react';
import * as _ from 'lodash';

const DEFAULT_DEBOUNCE_TIMEOUT = 400;

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


export default class AbstractFormControl extends React.Component<IFormControlProps, IFormControlState> {

  validateDebounce: Function;

  constructor(props: IFormControlProps, context) {
    super(props, context);

    this.state = {
      valid: true,
      focus: false,
      touch: false,
      dirty: false,
      enable: true,
      loading: false,
      value: ''
    }

    this.validateDebounce =
     _.debounce(() => {
      this.validate();
      }, this.debounce); 
    
  }

  /**
   * get placeholder or focus placeholder
   */
  get placeholder(): string {
    if (this.state.focus && this.props.focusPlaceholder) {
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

  /**
   * Get value to be displayed.
   * If valueToDisplay function is defined it will return the result of it execution.
   */
  get value(): string {
    if(this.props.valueToDisplay) {
      return this.props.valueToDisplay(this.state.value)
    }
    return this.state.value
  }

  get wrapperClass() {
    if(this.state.valid) {
      return 'form-group'
    } else {
      return 'form-group has-error'
    }
  }

  get label() {
    return this.props.label ? this.props.label : this.props.name;
  }

  onChange(event) {
    this.setState({value: event.target.value}, this.validateDebounce.bind(this));
    this.setState({dirty: true}, () => this.notifyParent());
  }

  notifyParent() {
    if(this.props.onChange) {
      this.props.onChange(this.state, this.props.name);
    } 
  }

  validate() {
    let validSync = this.validateSync();
    if(validSync && this.props.validatorsAsync) {
      this.setState({loading: true}, () => this.notifyParent())
      this.validateAsync().then((validAsync) => {
        this.setState({valid: validAsync}, () => this.notifyParent());    
        this.setState({loading: false}, () => this.notifyParent())
        
      })
    } else {
      this.setState({valid: validSync}, () => this.notifyParent());    
    }
  }

  validateSync(): boolean {
    return this.props.validators.reduce((acc, validator) => {
      return acc && validator.call(this, this);
    }, true);
  }

  reduceBooleanArray(arr: Array<boolean>) {
    return arr.reduce((acc, item) => {
      return acc && item;
    }, true);
  }

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

  onFocus(event) {
    if(this.props.onFocus) {
      this.props.onFocus(event);
    } 
    this.setState({focus: true});
    this.setState({touch: true});
  }

  onBlur(event) {
    if(this.props.onBlur) {
      this.props.onBlur(event);
    } 
    this.setState({focus: false}, ()=> this.notifyParent())
  }

  get loading() {
    return this.state.loading;
  }

  getState() {
    return this.state;
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
            value={this.value}
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
  async validations ???????*/*/
