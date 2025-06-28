import { Route, Routes } from 'react-router-dom';
import './index.css';
import './app.css';
import Index from './components';
import Login from './components/Login';

function App() {
  return(
    <Routes>
      <Route index element={<Index />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App;
