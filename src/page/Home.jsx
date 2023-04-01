import React, { useState, useEffect, useRef } from 'react';
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'; 

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

    const [file, setFile] = useState("");

        // progress
        const [percent, setPercent] = useState(0);
     
        // Handle file upload event and update state
        function handleChange(event) {
            setFile(event.target.files[0]);
        }
     
        const handleUpload = () => {
            if (!file) {
                alert("Please upload an image first!");
            }
     
            const storageRef = ref(storage, `/files/${file.name}`);

     
            // progress can be paused and resumed. It also exposes progress updates.
            // Receives the storage reference and the file to upload.
            const uploadTask = uploadBytesResumable(storageRef, file);
     
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
     
                    // update progress
                    setPercent(percent);
                },
                (err) => console.log(err),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        console.log(url);
                    });
                }
            );
        };
     
        return (
            <div>
                <input type="file" onChange={handleChange} accept="/image/*" />
                <button onClick={handleUpload}>Upload to Firebase</button>
                <p>{percent} "% done"</p>
            </div>
        );



}

export default Home


