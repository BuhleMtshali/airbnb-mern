import { Route, Routes } from 'react-router-dom'
import './App.css'
import Index from './components/Index'
import Login from './components/Login'
import Layout from './Layout'
import Register from './components/Register'
import axios from "axios";
import { UserContextProvider } from './UserContext'
import Profile from './components/Profile'
import Places from './components/Places'
import Bookings from './components/Bookings'
import PlacesForm from './components/PlacesForm'
import Place from './components/Place'
import Booking from './components/Booking'

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Homepage */}
          <Route index element={<Index />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* ACCOUNT ROUTES NESTED */}
          <Route path="account">
            <Route index element={<Profile />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<Booking />} />
            <Route path="places" element={<Places />} />
            <Route path="places/new" element={<PlacesForm />} />
            <Route path="places/:id" element={<PlacesForm />} />
          </Route>

          {/* PLACE ROUTE */}
          <Route path="place/:id" element={<Place />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App;
