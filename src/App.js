import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from './components/Search/Search'
import Table from './components/Table/Table'
import { Routes, Route } from 'react-router-dom'
import './App.css'


function App() {
  const navigate = useNavigate();

  //установка в параметр страницы 1 при первом запуске
  useEffect(() => {
    navigate('/1');
  }, []);

  return (
    <div className="App">
      <Search/>
      <Routes>  
        <Route path="/:page" element={<Table />}/>
      </Routes>
    </div>
  );
}

export default App;
