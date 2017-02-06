import * as React from 'react';

interface IProps {
    name: string; 
    label: string; 
    onChange: any;
    placeholder?: string;
    value?: string; 
    error?: string;
};

const TextInput = ({name, label, onChange, placeholder, value, error}: IProps) => {

    let wrapperClass = 'form-group';
    if(error && error.length >0) {
        wrapperClass += ' has-error';
    }

    return (
        <div className={wrapperClass}>
            <label htmlFor={name}>{label}</label>
            <div className="field">
                <input
                    type="text"
                    name={name}
                    className="form-control"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange} />
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
};

/*(<any>TextInput).propTypes = {
    name: React.PropTypes.string.isRequired, 
    label: React.PropTypes.string.isRequired, 
    onChange: React.PropTypes.func.isRequired, 
    placeholder: React.PropTypes.string, 
    value: React.PropTypes.string, 
    error: React.PropTypes.string
};*/

export default TextInput;