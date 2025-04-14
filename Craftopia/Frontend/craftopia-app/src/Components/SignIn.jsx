import 'font-awesome/css/font-awesome.min.css'; 
import { useState } from 'react';
import SignUp from './SignUp';

const SignIn = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setIsOpen(false); 
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

        <h2 className="text-2xl font-bold mb-6 text-black text-center">Sign In</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-black font-medium">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-black font-medium">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-black"
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
