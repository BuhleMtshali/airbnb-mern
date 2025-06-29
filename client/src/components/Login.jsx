import { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { Navigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg("Email and password are required.");
      return;
    }

    try {
      const { data } = await axios.post('/login', { email, password });
      setUser(data); // Store user in context
      alert('Login successful');
      setRedirect(true);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      if (error.response?.status === 422) {
        setErrorMsg("Incorrect password. Please try again.");
      } else if (error.response?.status === 404) {
        setErrorMsg("User not found. Please register.");
      } else {
        setErrorMsg("Login failed. Try again.");
      }
    }
  };

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          {errorMsg && <div className="text-red-500 text-center mb-2">{errorMsg}</div>}
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{' '}
            <Link className="underline text-black" to={'/register'}>
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
