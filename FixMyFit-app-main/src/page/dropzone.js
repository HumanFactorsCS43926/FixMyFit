import React, { useCallback ,useState, useRef, useMemo, useEffect} from 'react'
import { useDropzone } from 'react-dropzone';
import {db,storage,useAuth} from '../firebase';
import { addDoc,getDoc, arrayUnion,updateDoc,doc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes} from "@firebase/storage";

export default function Dropzone() {
  const currentUser = useAuth();
  const [selectedImages, setSelectedImages]= useState([]);
  const [userData, setUserData] = useState(null); // state to store user data
  const postRef = useRef(null);
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const focusedStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };
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

  const uploadPost = async () => {
    if (!userData) {
      console.log("User data is not available yet");
      return;
    }
    const docRef = await addDoc(collection(db, 'post'), {
      post: postRef.current.value,
      timestamp: serverTimestamp(),
      user: currentUser.uid,
      userName: userData.userName,
      images: selectedImages.map((image) => image.downloadURL),
    });
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
            preview:URL.createObjectURL(file),
            downloadURL: ''
        })))

  },[])

  const {getRootProps,getInputProps,isFocused,
        isDragAccept,
        isDragReject} = useDropzone({onDrop, accept:'image/*'})

        const style = useMemo(() => ({
          ...baseStyle,
          ...(isFocused ? focusedStyle : {}),
          ...(isDragAccept ? acceptStyle : {}),
          ...(isDragReject ? rejectStyle : {})
        }), [
          isFocused,
          isDragAccept,
          isDragReject
        ]);

  const selected_images = selectedImages?.map(file=>(
    <div>
        <img src={file.preview} style={{width:"600px"}}alt=""/>
    </div>
  ))

  const isUploadDisabled = selectedImages.length === 0;
  useEffect(() => {
    getUserData();
  }, [currentUser]);

  return(
    <div style={{marginTop: "20%"}}>
  
      <div {...getRootProps({style: {
        border: "1px solid #ccc",
        padding: "8px 16px",
        marginTop: "10px",
        width: "200px",
        color: "#777",
        background: "#fff",
        marginBottom: "10px", // add margin-bottom for spacing
      }})}>
        <input {...getInputProps()} />
        <p>Drop the files here</p>
      </div>
  
      {selected_images}
      <div>
      <input ref={postRef} type="text" placeholder='enter post description...' style={{ width: "631px", marginBottom: "10px", textAlign: "center"  }} />

  <button
    onClick={uploadPost}
    disabled={isUploadDisabled}
    className=""
    style={{
      color: "WHITE",
      border: "1px solid #09C7E1",
      padding: "8px 16px",
      backgroundColor: "#09C7E1",
      borderRadius: "5px",
      fontWeight: "bold",
      width: "631px", // Set the width to 100%
      display: "block",
    }}
  >
    Post
  </button>
</div>

    </div>
  );
}
