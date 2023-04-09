import React, {useState, useEffect} from 'react';

 
import Home from './page/Home';
import Dropzone from './page/dropzone';
import SearchPage from './page/SearchPage';
import Notes from './page/Notes';
import Signup from './page/Signup';
import Login from './page/Login';


import {Routes, Route} from 'react-router-dom';
// import Navbar from './components/widgets/Navbar';
import SearchBar from './components/widgets/SearchBar';
import Layout from './components/widgets/Layout';
import { BrowserRouter as Router } from 'react-router-dom';


function App() {

  return (
    <Router>
      <div className="App bg-primary">
        <section>          
          <div>            
            <Routes>

                <Route 
                  path="/SearchPage"
                  element={
                    <Layout>
                      <SearchPage/>
                        <SearchBar placeholder="Find your fit..."/>
                    </Layout>
                  
                  }
                />
                <Route 
                  path="/home"
                  element={
                    <Layout>
                      < Home />
                    </Layout>
                  
                  }
                />

                <Route 
                  path="/notes"
                  element={
                    <Layout>
                      <Dropzone/>
                    </Layout>
                  
                  }
                />      
              
              <Route path="/" element={<Signup/>}/>
              <Route path="/login" element={<Login/>}/>
            </Routes>          
          </div>
        </section>

      </div>
    </Router>
  );
}

export default App;



