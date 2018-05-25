import React from 'react';
import { isValid, Validator } from '../../lib/validators';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    id: string;
    placeholder: string;
    value: string;
    onChangeAlt?: (e: React.ChangeEvent<HTMLInputElement>, value: string, valid: boolean) => void;
    validators?: Validator[];
    onValidateResult?: (id: string, result: boolean) => void;
}

export const rv = (value: string, required: boolean | undefined, validators: Validator[]) => required ?
    value.length > 0 && isValid(value, validators) :
    value.length === 0 || isValid(value, validators);

export const AdminInput = ({
                               id,
                               placeholder,
                               validators = [],
                               required,
                               children,
                               onChangeAlt,
                               ...props
                            }: AdminInputProps) => {
    const validationResult = rv(props.value, required, validators);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(props.onChange) {
            props.onChange(e);
        }
        if(onChangeAlt) {
            onChangeAlt(e, e.currentTarget.value, validationResult);
        }
    };

    if(props.onValidateResult) {
        props.onValidateResult(id, validationResult);
    }

    return (
        <div className="form-label-group material">
            <input { ...props }
                   autoComplete="off"
                   className={ 'form-control' + (validationResult ? '' : ' is-invalid') }
                   placeholder={ placeholder }
                   required={ required }
                   onChange={ onChange }
                   id={ id } />
            <label htmlFor={ id }>{ placeholder }</label>
            { children }
        </div>
    );
};