import React, { useCallback ,useState, useRef} from 'react'
import { useDropzone } from 'react-dropzone';
import {db,storage,useAuth} from '../firebase';
import { addDoc, arrayUnion,updateDoc,doc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes} from "@firebase/storage";
export default function Dropzone() {
  const currentUser = useAuth();
  const [selectedImages, setSelectedImages]= useState([]);
  const postRef = useRef(null);

  const uploadPost = async()=>{
    const docRef = await addDoc(collection(db,"post"),{
      post:postRef.current.value,
      timestamp:serverTimestamp(),
      user:currentUser.uid

    })
    await Promise.all(
      selectedImages.map(image=>{
        const imageRef = ref(storage, `post/${docRef.id}/${image.path}`);
        uploadBytes(imageRef,image,"data_url").then(async()=>{
          const downloadURL = await getDownloadURL(imageRef)
          await updateDoc(doc(db,"post",docRef.id),{
            images:arrayUnion(downloadURL)
          })
        })
      })
    )
    postRef.current.value='';
    setSelectedImages([]);

  }
  const onDrop = useCallback(acceptedFiles =>{
    setSelectedImages(acceptedFiles.map(file=>
        Object.assign(file,{
            preview:URL.createObjectURL(file)
        })))

  },[])

  const {getRootProps,getInputProps} = useDropzone({onDrop})

  const selected_images = selectedImages?.map(file=>(
    <div>
        <img src={file.preview} style={{width:"200px"}}alt=""/>
    </div>
  ))
  return(
    <div>
    
    <input ref={postRef} type="text" placeholder='enter a post'/>
    <div {...getRootProps()}>
        <input {...getInputProps()}/>
        
            <p>Drop the the files here</p>
    </div>
    <button onClick={uploadPost}>post</button>
    {selected_images}
    </div>
  )
}