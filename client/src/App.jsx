import { Route, Routes } from 'react-router-dom';
import './index.css';
import './app.css';
import Index from './components';
import Login from './components/Login';
import Layout from './Layout';
import Register from './components/Register';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import Profile from './components/Profile';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route index element={<Index />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/account' element={<Profile />} />
          <Route path='/account/bookings' element={<Profile />} />
          <Route path='/account/places' element={<Profile />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
