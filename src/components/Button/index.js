import React from 'react';

const Button = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>
)

const Loading = () => (
  <div>Loading...</div>
)

const withLoading = (Component) => ({isloading, ...rest}) => (
  isloading
  ? <Loading />
  : <Component {...rest} />
)

const ButtonWithLoading = withLoading(Button);

export default Button;