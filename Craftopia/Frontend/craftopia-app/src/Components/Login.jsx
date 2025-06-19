import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Heart, ShoppingCart } from 'lucide-react';

const Login = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login }                   = useAuth();
  const navigate                    = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const { data } = await axios.post(
        'http://localhost:3000/auth/login',
        { email, password }
      );

      // Tell context about the new token:
      login(data.token);
      setSuccessMessage('Login successful!');

      // Redirect based on role returned by backend
      if (data.role === 'artist') {
        navigate('/artist-profile');
      } else if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-burgundy">Welcome Back</h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="bg-auction-card rounded-lg shadow-lg p-8">
          {successMessage && (
            <p className="text-green-600 text-center mb-4">
              {successMessage}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-burgundy mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-burgundy mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-coral focus:ring-coral border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-muted-foreground"
                >
                  Remember me
                </label>
              </div>
              <Link to="#" className="text-sm text-coral hover:text-burgundy">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-coral text-white py-2 px-4 rounded-md font-semibold hover:bg-burgundy transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-coral hover:text-burgundy font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-burgundy mb-4">Why join Craftopia?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-burgundy/70">
            <div>
              <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="h-6 w-6 text-coral" />
              </div>
              <p>Connect with talented artisans</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="h-6 w-6 text-coral" />
              </div>
              <p>Discover unique handcrafted items</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <ShoppingCart className="h-6 w-6 text-coral" />
              </div>
              <p>Support local craftspeople</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
