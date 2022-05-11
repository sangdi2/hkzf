import React from 'react';
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom';
import Map from './pages/Map';

import Home from './pages/Home';

const App=()=>{
  return (
    <Router>
      <div className='App'>
  
           <Route exact path="/" render={()=><Redirect to="/home"/>}/>
           <Route path="/home" component={Home}/>
           <Route path="/map" component={Map}/>

      </div>
    </Router>
  )
}

export default App;
