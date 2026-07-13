/*import Home from "./pages/Home";

function App() {
  return <Home />;
}

export default App;*/

import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Card from './pages/Card';
import Sponsor from './pages/Sponsor';
import Calendar from './pages/Calendar';
import News from './pages/News';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Admin from './pages/Admin';


function App() {
  return (
    <>
      <Header /> {/* Questa è la prima barra in alto che rimarrà fissa */}
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/card" element={<Card />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/news" element={<News />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </main>
    </>
  );
}

export default App;