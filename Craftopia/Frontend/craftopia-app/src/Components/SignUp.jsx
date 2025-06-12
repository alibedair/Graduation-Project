import 'font-awesome/css/font-awesome.min.css';
import { useState } from 'react';
import SignIn from './SignIn';
import axios from 'axios';

const SignUp = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSignInClick = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      email,
      password,
      role: role.toLowerCase(),
    };

    console.log('Sending registration data:', requestData);

    try {
      const response = await axios.post('http://localhost:3000/auth/register', requestData);
      console.log('Register success:', response.data.message || response.data);
      setSuccessMessage('Registration successful!');
      setError('');
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);

    } catch (err) {
      setSuccessMessage('');
      if (err.response) {
        console.error('Registration error:', err.response.data);
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.data.errors) {
          setError(err.response.data.errors.map(e => e.msg).join(', '));
        } else {
          setError('An unknown error occurred.');
        }
      } else {
        setError('An error occurred during registration.');
      }
    }
  };

  if (!isOpen) {
    return <SignIn />;
  }
  { successMessage && <div className="text-green-600 text-center mb-4">{successMessage}</div> }

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

        <h2 className="text-2xl font-bold mb-6 text-black text-center">Create your account</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-black text-sm font-medium">
              Email address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
            />
          </div>


          <div>
            <label htmlFor="password" className="block mb-1 text-black text-sm font-medium">
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
            />
          </div>

          <div>
            <label className="block mb-1 text-black text-sm font-medium">Sign up as *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-black">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Customer
              </label>
              <label className="flex items-center gap-2 text-black">
                <input
                  type="radio"
                  name="role"
                  value="artist"
                  checked={role === 'artist'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Artist
              </label>
              <label className="flex items-center gap-2 text-black">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Admin
              </label>
            </div>
          </div>

          <div className="text-center mt-4 text-sm text-black">
            By clicking Register or Continue with Google or Facebook you agree to our Terms of Use and Privacy Policy.
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-[#FAF9F6] hover:text-black border hover:border-black transition duration-300"
          >
            Register
          </button>
        </form>

        <div className="mt-4 space-y-2">
          <button
            className="w-full text-black border border-black py-2 rounded transition duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-md"
            onClick={() => console.log('Google sign up as', role)}
          >
            <i className="fa fa-google text-xl"></i>
            <span>Continue with Google</span>
          </button>

          <button
            className="w-full text-black border border-black py-2 rounded transition duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-md"
            onClick={() => console.log('Facebook sign up as', role)}
          >
            <i className="fa fa-facebook text-xl"></i>
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-black">
            Already have an account?{' '}
            <a
              href="#"
              onClick={handleSignInClick}
              className="text-[#921A40] font-bold hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
