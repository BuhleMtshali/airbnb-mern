import { Route, Routes } from 'react-router-dom';
import './index.css';
import './app.css';
import Index from './components';

function App() {
  return(
    <Routes>
      <Route index element={<Index />} />
    </Routes>
  )
}

export default App;
