import React, { useState, useEffect, useRef } from 'react';
import "./SearchBar.css";

const SearchBar = ({placeholder, data}) => {  
  return (
  <div className="search">
    <div className="searchInputs">
      <input type="text" placeholder={placeholder}/>
    </div>
    <div className="dataResult"></div>
  </div>
  );
}

export default SearchBar