import React, { useState, useEffect } from "react";
import "./Form.css";
import Swal from 'sweetalert2';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import bgVid from '../videos/bgVid3.mp4';

const API_URL = 'https://bqms-backend.onrender.com'; 

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const clientId = '406766184823-dln4eflvfpjn2c9h5mbekjuudoh681ra.apps.googleusercontent.com';
  
    const [isLogin, setIsLogin] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regFullName, setRegFullName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Toggle between Sign In and Sign Up
  const handleRegisterClick = () => setIsSignUp(true);
  const handleLoginClick = () => setIsSignUp(false);

   useEffect(() => {
      if (user) {
        navigate('/App');
      }
    }, [user, navigate]);


     const handleLogin = async (e) => {
        e.preventDefault();
    
        if (loginEmail === 'admin@email.com' && loginPassword === 'Admin') {
          Swal.fire({
            icon: 'success',
            title: 'Admin Login Successful',
            text: 'Welcome to the Admin Dashboard.',
          });
          navigate('/Admin');
          return;
        }
    
        try {
          const { data } = await axios.post(`${API_URL}/login`, {
            email: loginEmail,
            password: loginPassword,
          });
    
          login(data.accessToken, data.user);
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: `Welcome back, ${data.user.fullName || 'User'}!`,
          });
          navigate('/App');
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.response?.data?.message || 'Invalid email or password.',
          });
        }
      };
    
      // 🔹 Handle Google Login
      const onGoogleLoginSuccess = async (response) => {
        const { credential: tokenId } = response;
        if (!tokenId) {
          Swal.fire({
            icon: 'error',
            title: 'Google Login Failed',
            text: 'No credential received. Please try again.',
          });
          return;
        }
    
        try {
          const { data } = await axios.post(`${API_URL}/google-login`, { tokenId });
    
          login(data.accessToken, data.user);
          Swal.fire({
            icon: 'success',
            title: 'Google Login Successful',
            text: 'You have successfully logged in with Google.',
          });
          navigate('/App');
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Google Login Failed',
            text: error.response?.data?.message || 'Something went wrong. Please try again.',
          });
        }
      };
    
      const onGoogleLoginFailure = () => {
        Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          text: 'Please try again.',
        });
      };
    
      // 🔹 Handle Registration
      const handleRegister = async (e) => {
        e.preventDefault();
    
        if (regPassword !== regConfirmPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Passwords do not match',
            text: 'Please make sure your passwords match.',
          });
          return;
        }
    
        try {
          await axios.post(`${API_URL}/register`, {
            fullName: regFullName,
            email: regEmail,
            password: regPassword,
            confirmPassword: regConfirmPassword,
          });
    
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your account has been created successfully.',
          });
    
          setRegFullName('');
          setRegEmail('');
          setRegPassword('');
          setRegConfirmPassword('');
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.response?.data?.message || 'Something went wrong. Please try again.',
          });
        }
      };

      

  return (
     <GoogleOAuthProvider clientId={clientId}>
      <div className={`container ${isSignUp ? "active" : ""}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleRegister}>
            <h1 className="cra">Create Account</h1>
            <div className="social-icons">
              <GoogleLogin
                onSuccess={onGoogleLoginSuccess}
                onError={onGoogleLoginFailure}
                theme="outline" 
                text="signin_with" 
                shape="rectangular" 
                size="large" 
                logo_alignment="left" 
              />
            </div>
            <span>or use your email for registration</span>
            <input type="text" 
              placeholder="Full Name" 
              value={regFullName} 
              onChange={(e) => setRegFullName(e.target.value)}
              required 
            />
            <input type="email" 
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
            <input type="password" 
              placeholder="Password" 
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />
            <input type="password" 
              placeholder="Confirm Password" 
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1 className="si">Sign In</h1>
         
            <span>or use your email and password</span>
            <input type="email" 
              placeholder="Email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input type="password" 
              placeholder="Password" 
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <a href="#">Forget Your Password?</a>
            <button type="submit">Sign In</button>
            <div className="social-icons">
              <GoogleLogin
                onSuccess={onGoogleLoginSuccess}
                onError={onGoogleLoginFailure}
                theme="outline" 
                text="signin_with" 
                shape="rectangular" 
                size="large" 
                logo_alignment="left" 
              />
            </div>
          </form>
        </div>

        {/* Toggle Panel */}
        <div className="toggle-container2">
          <video src={bgVid} autoPlay muted loop playsInline></video>
          <div className="toggle2">
            <div className="toggle-panel toggle-left2">
              <h1>Welcome Back!</h1>
              <p>Ready, Set, Play!</p>
              <br />
              <button className="hidden" onClick={handleLoginClick}>
                Sign In?
              </button>
            </div>
            <div className="toggle-panel toggle-right2">
              <h1>Join Now!</h1>
              <p>Seamless Queues, Smarter Play!</p>
              <br />
              <button className="hidden" onClick={handleRegisterClick}>
                Sign Up?
              </button>
            </div>
          </div>
        </div>
      </div>
     </GoogleOAuthProvider>
    
  );
};

export default LoginPage;
