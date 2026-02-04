import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            <Link to="/">Eventify</Link>
          </h1>
          <h2 className="mt-2 text-center text-2xl font-bold text-gray-800">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you a link to get back into your account.
          </p>
        </div>
        <Card className="p-8 space-y-6">
          <form className="space-y-6">
            <Input
              label="Email address"
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>
          <div className="text-center text-sm">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
