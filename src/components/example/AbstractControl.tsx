import * as React from 'react';
import * as _ from 'lodash';

export const DEFAULT_DEBOUNCE_TIMEOUT = 400;

export interface IAbstractControlState {
  name: string;
  valid?: boolean;
  focus?: boolean;
  touch?: boolean;
  dirty?: boolean;
  enable?: boolean;
  loading?: boolean; 
  controls?: any;
  value: any;
  
}

interface IChild {
  children: Array<any>;
  onChange: Function;
  name: string;
  value?: any;
  state: any;
}


interface IAbstractControlValidatorSync {
  (f: AbstractControl): boolean;
}

interface IAbstractControlValidatorAsync {
  (f: AbstractControl): Promise<Boolean>;
}


export interface IAbstractControlProps {
  name: string;
  array?: Array<any>;
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

  validateDebounce: Function;

  constructor(props: IAbstractControlProps, context) {
    super(props, context);

    this.validateDebounce =
      _.debounce(() => {
        this.validate();
      }, this.debounce);
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

  validate(): void {
    throw 'must be implemented';
  }

  /**
   * get debounce timeout if not defined returns DEFAULT_DEBOUNCE_TIMEOUT
   */
  get debounce() {
    return _.isNumber(this.props.debounce) ? this.props.debounce: DEFAULT_DEBOUNCE_TIMEOUT;
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

  private getValueGroup(controls) {
    let _value = {}
    for (let key of Object.keys(controls)) {
      _value[key] = controls[key].value ? controls[key].value : ''
    }
    return _value;
  }

  // helper function to get values from the controls
  private getValueArray(controls) {
    return controls.map((control) => control.value)
  }

  /**
   * Change the state and notify the parent
   * TODO set dirty and touch
   */

  onChangeGroup(state, name) {
    let self = this;

    let controls = {
      ...this.state.controls,
      [name]: state
    };

    this.setState(
      {
        ...this.state,
        controls: controls,
        value: self.getValueGroup(controls)
      }, () => {
        this.validateDebounce();
        this.notifyParent();
      });
  }

  onChangeArray(state, name) {
    let self = this;

    let controls = this.state.controls.map((control) => {
      if(control.name === name) {
        return state
      }
      return control
    })

    this.setState(
      {
        ...this.state,
        controls: controls,
        value: self.getValueArray(controls)
      }, () => {
        this.validateDebounce();
        this.notifyParent();
      });
  }


  recursiveCloneChildren(children: any, state: any, parentType: string ='other') {

    return React.Children.map(children, (child: React.ReactElement<IChild>) => {

      if (!React.isValidElement(child)) return child;

      const childProps: any = _.cloneDeep(child.props);

      const isFormGroup = _.get(child,'type.name','') === 'FormGroup';
      const isFormControl = _.get(child,'type.name','') === 'FormControl';
      const isFormArray = _.get(child,'type.name','') === 'FormArray';

      let controlState: any = {
        name: child.props.name,
        valid: true,
        focus: false,
        touch: false,
        dirty: false,
        enable: true,
        loading: false
      };

      if (isFormGroup) {
        controlState.controls = {};
        controlState.value = child.props.value || {};
      }

      if(isFormArray) {
        controlState.controls = []
        controlState.value = child.props.value || [];
      }

      if(isFormControl) {
        controlState.value = '';
      }


      if (parentType === 'FormGroup' && (isFormArray || isFormGroup || isFormControl)) {
        
        state.controls = {
            ...state.controls,
            [child.props.name]: controlState
          };
      }

      if (parentType === 'FormArray' && (isFormArray || isFormGroup || isFormControl)) {
        state.controls.push(controlState);
      }

      if(isFormGroup) {
        childProps.children = this.recursiveCloneChildren(child.props.children, controlState, 'FormGroup');
      }

      if(isFormArray) {
        childProps.children = this.recursiveCloneChildren(child.props.children, controlState, 'FormArray');
      }

      if (isFormArray || isFormGroup || isFormControl) {
        
        if(parentType === 'FormArray') {
          childProps.onChange = this.onChangeArray.bind(this);
        }

        if(parentType === 'FormGroup') {
          childProps.onChange = this.onChangeGroup.bind(this);
        }
        
        return React.cloneElement(child, childProps)
      }
    
      if(!_.get(child,'props.chilren',undefined)) {
        
        childProps.children = this.recursiveCloneChildren(child.props.children, state, parentType);
      }
      
      return React.cloneElement(child, childProps);
    })
  }

  render() {
    return (<h1>Render not implemented</h1>);
  }

}

