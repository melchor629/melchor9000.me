/* eslint-disable react/jsx-props-no-spreading */
import clsx from 'clsx'
import React from 'react'

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string
  id: string
  placeholder: string
  error: any
}

interface AdminBigInputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  type: string
  id: string
  placeholder?: string
  error: any
}

export const AdminInput = React.forwardRef(({
  id,
  placeholder,
  required,
  children,
  error,
  ...props
}: AdminInputProps, ref: React.ForwardedRef<HTMLInputElement>) => (
  <div className="form-label-group material">
    <input
      {...props}
      ref={ref}
      autoComplete="off"
      className={clsx('form-control', error && 'is-invalid')}
      placeholder={placeholder}
      required={required}
      id={id}
    />
    <label htmlFor={id}>{ placeholder }</label>
    { children }
  </div>
))

export const AdminBigInput = React.forwardRef(({
  id,
  placeholder,
  required,
  children,
  error,
  ...props
}: AdminBigInputProps, ref: React.ForwardedRef<HTMLTextAreaElement>) => (
  <div className="form-group material mb-3" style={{ position: 'relative' }}>
    { placeholder }
    <textarea
      {...props}
      ref={ref}
      className={clsx('form-control', error && 'is-invalid')}
    />
    { children }
  </div>
))

AdminBigInput.defaultProps = {
  placeholder: '',
}
