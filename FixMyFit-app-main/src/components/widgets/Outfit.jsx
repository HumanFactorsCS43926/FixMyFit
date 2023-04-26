import React, { useCallback, useState, useRef} from "react";
import Dropzone from '../../page/dropzoneWar';
import {db, storage, useAuth} from '../../firebase';
import { addDoc, getDoc, arrayUnion, updateDoc, doc, collection, serverTimestamp } from "firebase/firestore";
import "./outfit.css"
import { useEffect, useContext } from "react";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";


const Outfit = () => {
    const currentUser = useAuth();
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [userData, setUserData] = useState(null); // state to store user data
    const postRef = useRef(null);
    const [selectedImages, setSelectedImages]= useState([]);
    const [canvasDataURL, setCanvasDataURL] = useState(null);

    const getUserData = async () => {
        if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(userData.userName);
            setUserData(userData);
        } else {
            console.log("User not found");
        }
        } else {
        console.log("No user is currently logged in");
        }
    }

    const uploadPost = async (event) => {
        const canvas = canvasRef.current;
        // const canvasDataURL = canvas.toDataURL();
        // const imageBlob = dataURLtoBlob(canvasDataURL);
        // setSelectedImages([imageBlob]);
        // if (!userData) {
        //     console.log("User data is not available yet");
        //     return;
        // }
        // const docRef = await addDoc(collection(db, 'post'), {
        //     post: postRef.current.value,
        //     timestamp: serverTimestamp(),
        //     user: currentUser.uid,
        //     userName: userData.userName,
        //     images: selectedImages.map((image) => image.downloadURL),
        // });
        
        // postRef.current.value='';
        // setSelectedImages([]);
    }

    const onDrop = (event) => {
        event.preventDefault();
        const imageURL = event.dataTransfer.getData("text/plain");
        const img = new Image();
        img.onload = () => {
            
            // context.drawImage(img, 0, 0, 100, 100);
            if (images.length === 0) {
                setImages([img]);
            } else {
                setImages(prevImages => [...prevImages, img]);
            }
            
            console.log(images);
        }
        img.src = imageURL;
    }

   
    useEffect(() => {
        drawImages();
    }, [images])

    const onDragOver = (event) => {
        event.preventDefault();
    }

    const drawImages = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);
        const numCols = 4;
        const numRows = Math.ceil(images.length / numCols);
        const boxWidth = canvas.width / numCols;
        const boxHeight = canvas.height / numRows;
        images.forEach((image, index) => {
            if (image.complete) {
                const imageWidth = image.width;
                const imageHeight = image.height;
                const aspectRatio = imageWidth / imageHeight;
                let drawWidth;
                let drawHeight;
                if (boxHeight > boxWidth) {
                    drawWidth = boxWidth;
                    drawHeight = drawWidth / aspectRatio;
                }
                else {
                    drawHeight = boxHeight;
                    drawWidth = drawHeight * aspectRatio;
                }
                const colIndex = index % numCols;
                const rowIndex = Math.floor(index / numCols);
                const x = colIndex * boxWidth;
                const y = rowIndex * boxHeight;
                context.drawImage(image, x, y, drawWidth, drawHeight);
            }
            
        })
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);
        setImages([]);
        console.log(images);
    }
    return (
        <div className="outfit">
            <h1>Create a fit</h1>
            <canvas onDrop={onDrop} onDragOver={onDragOver} ref={canvasRef} />
            <input ref={postRef} type="text" placeholder='enter post description...' style={{ width: "100%", marginBottom: "10px", textAlign: "center"  }} />
            <div className="outfitButtons">
                <button id="postButton" onClick={uploadPost}>Post</button>
                <button id="clearButton" onClick={clearCanvas}>Clear</button>
            </div>
            
        </div>
    )
}

export default Outfit;