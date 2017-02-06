import * as React from 'react';
import * as _ from 'lodash';

const DEFAULT_DEBOUNCE_TIMEOUT = 400;

export interface IFormState {
  valid?: boolean;
  focus?: boolean;
  touch?: boolean;
  dirty?: boolean;
  enable?: boolean;
  loading?: boolean; 
  value: string;
}

interface IFormValidator {
  (f: FormControl): boolean;
}

interface IFormValidatorAsync {
  (f: FormControl): Promise<Boolean>;
}


export interface IFormProps {
  name: string;
  
  label?: string;
  type?: 'text' | 'password';
  placeholder?: string;
  focusPlaceholder?: string;
  value?: string;
  debounce?: number;
  validators?: Array<IFormValidator>;
  validatorsAsync?: Array<IFormValidatorAsync>;
  valueToDisplay?: (value) => string;
  onChange?: (event: any) => boolean;
  onBlur?: (event: any) => boolean;
  onFocus?: (event: any) => boolean;
}


export default class FormControl extends React.Component<IFormProps, IFormState> {

  validateDebounce: Function;

  constructor(props: IFormProps, context) {
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
      this.validate(this.props.validators);
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

  get debounce() {
    return this.props.debounce || DEFAULT_DEBOUNCE_TIMEOUT;
  }

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
    if(this.props.onChange) {
      this.props.onChange(event);
    } else {
      this.setState({value: event.target.value}, this.validateDebounce.bind(this));
    }
    this.setState({dirty: true});
    this.validateAsync(this.props.validatorsAsync);
  }

  validateNew() {
    let validSync = this.validate(this.props.validators)
    if(validSync && this.props.validatorsAsync) {
      this.setState({loading: true})
      this.validateAsync(this.props.validatorsAsync).then((validAsync) => {
        this.setState({valid: validAsync});    
        this.setState({loading: false})
      })
    } else {
      this.setState({valid: validSync});    
    }
  }

  validate(validators: Array<IFormValidator>): boolean {

    return validators.reduce((acc, validator) => {
      return acc && validator.call(this, this);
    }, true);
  }

  validateAsync(validators: Array<IFormValidatorAsync>): Promise<boolean> {
    let _arr = [];
    _arr = validators.map((val) => val.call(this, this))

    return Promise.all(_arr).then((arr) => {
      console.log('res',arr)
      return true;
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
    this.setState({focus: false})
  }

  render() {
    console.log('Render', this.state);
    return (
      <div className={this.wrapperClass}>
        <p>###{this.state.valid.toString()} ###</p>
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
        </div>
      </div>  
    );
  }

}


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
