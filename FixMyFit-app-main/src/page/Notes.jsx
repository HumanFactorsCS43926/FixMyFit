
import React, { useState, useEffect, useRef } from 'react';
import { storage } from "../firebase";

const Notes = () => {
    // Get all the images from Storage
       const [files, setFiles] = useState();
   
   useEffect(() => {
       const fetchImages = async () => {
         let result = await storage.ref().child("files").listAll();
         let urlPromises = result.items.map((imageRef) =>
           imageRef.getDownloadURL()
         );
   
         return Promise.all(urlPromises);
       };
   
       const loadImages = async () => {
         const urls = await fetchImages();
         setFiles(urls);
       };
       loadImages();
   }, []);

}

export default Notes