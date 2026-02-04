import React from 'react';
import { Link } from 'react-router-dom';

// FIX: Add optional 'size' property to ButtonProps to allow for different button sizes.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

// FIX: Destructure 'size' prop with a default value of 'md'.
const Button: React.FC<ButtonProps> = ({ to, variant = 'primary', size = 'md', children, className, ...props }) => {
  // FIX: Removed padding ('py-2 px-6') from baseClasses to be handled by size variants.
  const baseClasses = "inline-block text-center font-semibold rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-400',
    outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-indigo-500',
  };

  // FIX: Added sizeClasses to handle different padding and font sizes based on the 'size' prop.
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-6',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
