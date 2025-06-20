import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Heart, ShoppingCart } from 'lucide-react';

const Register = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole]             = useState('customer');
  const [error, setError]           = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate                    = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:3000/auth/register',
        { email, password, role }
      );

      setSuccessMessage('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black/90">Create Account</h2>
          <p className="mt-2 text-muted-foreground">Sign up to get started</p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8">
          {successMessage && (
            <p className="text-green-600 text-center mb-4">
              {successMessage}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="email" className="block  text-sm font-medium text-burgundy mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg- px-4 py-2 focus:outline-none bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
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
                className="w-full px-4 py-2 border focus:outline-none bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-burgundy mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border focus:outline-none bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                placeholder="Re-enter your password"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-burgundy mb-2">
                I am a
              </label>
              <select
                id="role"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
              >
                <option value="customer">Customer</option>
                <option value="artist">Artist</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-coral text-white py-2 px-4 rounded-md font-semibold hover:bg-burgundy transition-colors"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-coral hover:text-burgundy font-medium">
                Sign in
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

export default Register;
