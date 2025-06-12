import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';

const SignIn = ({ onLoginSuccess }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setIsOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      console.log(response.data);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const { token, userId, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ userId, role }));

      setSuccessMessage('Login successful!');
      setError('');
      onLoginSuccess?.();

      if (role === 'artist') {
        navigate('/artist-profile');
      }
      else if (role === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
      setSuccessMessage('');
    }
  };

  if (showSignUp) return <SignUp />;
  if (!isOpen) return null;

  return (
    <div className="relative">
      <div className="fixed inset-0 bg-black opacity-50 z-40" />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FAF9F6] border border-black rounded-lg p-6 shadow-lg w-96 z-50">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-xl text-black hover:text-gray-500"
        >
          <i className="fa fa-times"></i>
        </button>

        <h2 className="text-2xl font-bold mb-4 text-black text-center">Sign In</h2>
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-black font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-black font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
              required
            />
          </div>

          <div className="text-right -mt-2 mb-2">
            <a href="#" className="text-sm text-[#921A40] underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-[#FAF9F6] hover:text-black border hover:border-black transition duration-300"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 space-y-2">
          <button
            className="w-full text-black border border-black py-2 rounded transition duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-md"
            onClick={() => console.log('Google sign up')}
          >
            <i className="fa fa-google text-xl"></i>
            <span>Continue with Google</span>
          </button>

          <button
            className="w-full text-black border border-black py-2 rounded transition duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-md"
            onClick={() => console.log('Facebook sign up')}
          >
            <i className="fa fa-facebook text-xl"></i>
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-black">
            Don't have an account?{' '}
            <button
              onClick={handleSignUpClick}
              className="text-[#921A40] font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
