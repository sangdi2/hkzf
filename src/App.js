import React from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';

import Home from './pages/Home';
const App=()=>{
  return (
    <Router>
      <div>
        <Routes>
        <Route path='/home' element={<Home/>}/>

        </Routes>
      </div>
    </Router>
  )
}

export default App;
