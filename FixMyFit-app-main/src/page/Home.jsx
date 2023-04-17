import React, {  useEffect } from 'react';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'; 

import Posts from './Posts';
const Home = () => {


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
            <div className="flex ">
              <div className="pl-5 p-5 mt-10 bg-gray-100 min-h-screen w-full">
                <Posts/>
              </div>
            </div>
        );



}

export default Home


