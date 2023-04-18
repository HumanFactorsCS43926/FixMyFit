import React, { useCallback ,useState, useRef, useMemo, useEffect} from 'react'
import { useDropzone } from 'react-dropzone';
import {db,storage,useAuth} from '../firebase';
import { onSnapshot, orderBy, query, addDoc, getDoc, getDocs, arrayUnion, updateDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes} from "@firebase/storage";


function Dropzone({clothingType}) {
  const currentUser = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedImages, setSelectedImages]= useState([]);
  const [userData, setUserData] = useState(null); // state to store user data
  
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
    getUserData();
    const docRef = await addDoc(collection(db, 'users', currentUser.uid, clothingType), {
      timestamp: serverTimestamp(),
      images: selectedImages.map((image) => image.downloadURL),
    });
    await Promise.all(
      selectedImages.map(image=>{
        const imageRef = ref(storage, `users/${docRef.id}/${image.path}`);
        uploadBytes(imageRef,image,"data_url").then(async()=>{
          const downloadURL = await getDownloadURL(imageRef)
          await updateDoc(doc(db,'users', currentUser.uid, clothingType, docRef.id),{
            images:arrayUnion(downloadURL)
          })
        })
      })
    )
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
        <img src={file.preview} style={{width:"200px"}}alt=""/>
    </div>
  ))

  const isUploadDisabled = selectedImages.length === 0;
  useEffect(() => {
    getUserData();
  }, [currentUser]);

  useEffect(() => {
    if (!userData) {
      console.log("User data is not available yet");
      return;
    }
    const collectionRef = collection(db, 'users', currentUser.uid, clothingType);
    const q = query(collectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => {
          console.log(doc.data()); // add this line to log the data object
          return {
            ...doc.data(),
            id: doc.id,
            timestamp: doc.data().timestamp?.toDate().getTime()
          };
        })
      );
    });

    return unsubscribe();
  }, []);

  return(
    <div>
      <div {...getRootProps({style})}>
          <input {...getInputProps()}/>
          <p>Drop the the pictures in here</p>
      </div>
      {selected_images}
      <button onClick={uploadPost} disabled={isUploadDisabled}className="
        group relative flex w-full justify-center rounded-md border border-transparent 
        bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">upload
      </button>
      <div>
      {posts.map((post) => (
        <div key={post.id}>
          {post.images.map((image, index) => (
            <img key={index} src={image} width={'auto'} />
          ))}
        </div>
      ))}
    </div>
  </div>
);
          }
export default Dropzone;
