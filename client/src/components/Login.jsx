import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { setUser } = useContext(UserContext);

  const handleLoginSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { data } = await axios.post('/login', { email, password });
      setUser(data);
      alert('Login successful');
      setRedirect(true);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-center">
      <div className="mb-64 w-full max-w-md p-8 border rounded-md shadow-lg">
        <h1 className="text-4xl text-center mb-6 font-semibold">Login</h1>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="input"
            aria-label="Email"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="input"
            aria-label="Password"
          />
          {errorMsg && (
            <div className="text-red-500 text-sm">{errorMsg}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{' '}
            <Link className="underline text-black" to='/register'>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
