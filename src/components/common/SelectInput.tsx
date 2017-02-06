import * as React from 'react';

interface IOptions {
  value: string;
  text: string;
}

interface IProps {
  name: string; 
  label: string; 
  onChange: any;
  defaultOption?: Object;
  value: string;
  error: string; 
  options: Array<IOptions>;
}


const SelectInput = ({name, label, onChange, defaultOption, value, error, options}: IProps) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <div className="field">
                <select
                    className="form-control"
                    name={name}
                    value={value}
                    onChange={onChange}>
                    {options.map((option) =>{
                        return <option key={option.value} value={option.value}>{option.text}</option>;
                    })    
                    }
                </select>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
};

/*(<any>SelectInput).propTypes = {
    name: React.PropTypes.string.isRequired, 
    label: React.PropTypes.string.isRequired, 
    onChange: React.PropTypes.func.isRequired, 
    defaultOption: React.PropTypes.string,
    value: React.PropTypes.string, 
    error: React.PropTypes.string,
    options: React.PropTypes.arrayOf(PropTypes.object)
};*/

export default SelectInput;