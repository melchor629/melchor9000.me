/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { isValid, Validator } from '../../lib/validators'

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string
  id: string
  placeholder: string
  value: string
  onChangeAlt?: (e: React.ChangeEvent<HTMLInputElement>, value: string, valid: boolean) => void
  validators?: Validator[]
  onValidateResult?: (id: string, result: boolean) => void
}

interface AdminBigInputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  type: string
  id: string
  placeholder?: string
  value: string
  onChangeAlt?: (e: React.ChangeEvent<HTMLTextAreaElement>, value: string, valid: boolean) => void
  validators?: Validator[]
  onValidateResult?: (id: string, result: boolean) => void
}

const rv = (value: string, required: boolean | undefined, validators: Validator[]) => (required
  ? value.length > 0 && isValid(value, validators)
  : value.length === 0 || isValid(value, validators))

export const AdminInput = ({
  id,
  placeholder,
  validators = [],
  required,
  children,
  onChangeAlt,
  onValidateResult,
  value,
  ...props
}: AdminInputProps) => {
  const validationResult = rv(value, required, validators)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e)
    }
    if (onChangeAlt) {
      onChangeAlt(e, e.currentTarget.value, validationResult)
    }
  }

  if (onValidateResult) {
    onValidateResult(id, validationResult)
  }

  return (
    <div className="form-label-group material">
      <input
        {...props}
        value={value}
        autoComplete="off"
        className={`form-control${validationResult ? '' : ' is-invalid'}`}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        id={id}
      />
      <label htmlFor={id}>{ placeholder }</label>
      { children }
    </div>
  )
}

AdminInput.defaultProps = {
  onChangeAlt: undefined,
  validators: undefined,
  onValidateResult: undefined,
}

export const AdminBigInput = ({
  id,
  placeholder,
  validators = [],
  required,
  children,
  onChangeAlt,
  onValidateResult,
  value,
  ...props
}: AdminBigInputProps) => {
  const validationResult = rv(value, required, validators)
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) {
      props.onChange(e)
    }
    if (onChangeAlt) {
      onChangeAlt(e, e.currentTarget.value, validationResult)
    }
  }

  if (onValidateResult) {
    onValidateResult(id, validationResult)
  }

  return (
    <div className="form-group material" style={{ position: 'relative' }}>
      { placeholder }
      <textarea
        {...props}
        value={value}
        className={`form-control${validationResult ? '' : ' is-invalid'}`}
        onChange={onChange}
      />
      { children }
    </div>
  )
}

AdminBigInput.defaultProps = {
  placeholder: '',
  onChangeAlt: undefined,
  validators: undefined,
  onValidateResult: undefined,
}
