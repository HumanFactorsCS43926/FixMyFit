import React, { useState, useEffect, useRef } from 'react';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'; 
import Profile from './Profile';
import Dropzone from './dropzone';
import Posts from './Posts';
const Home = () => {
    const [ openTaskInput, setOpenTaskInput ] = useState(false);
    const [open, setOpen] = useState(false);
    const [workMin, setWorkMin] = useState(45);
    const [breakMin, setBreakMin] = useState(15);
    const inputRef = useRef(null);
   

    const handleTaskButton = () => {
        setOpenTaskInput(true);
        inputRef.current.focus();
    }

    const handleSettings = () => {
        setOpen(true);
    }

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              // ...
              console.log("uid", uid)
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
            }
          });

        const intervalID = setInterval(()=>{
            // console.log("yes")
        }, 1000)  

        return () => clearInterval(intervalID);
    }, [])

     
        return (
            <div className="flex">
              <div className="p-5 bg-gray-100 min-h-screen w-full">
                <Posts/>
              </div>
            </div>
        );



}

export default Home


