import React, { useCallback ,useState, useRef, useMemo, useEffect} from 'react'
import { useDropzone } from 'react-dropzone';
import {db,storage,useAuth} from '../firebase';
import { where, QuerySnapshot, onSnapshot, orderBy, query, addDoc, getDoc, getDocs, arrayUnion, updateDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes} from "@firebase/storage";
import { getAuth } from 'firebase/auth';


function Dropzone({clothingType}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [userPants, setUserPants] = useState([]);
  const [userShirts, setUserShirts] = useState([]);
  const [userShoes, setUserShoes] = useState([]);
  const [userShorts, setUserShorts] = useState([]);
  const [userSocks, setUserSocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuth();
  const auth = getAuth();
  const user = auth.currentUser;
  const [username, setUsername] = useState(false);
  const userID = user.uid;
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
        setUsername(userData.userName);
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
    if(userID) {
      const pantsRef = collection(db, 'users', userID, 'pants');
      const shirtsRef = collection(db, 'users', userID, 'shirts');
      const shoesRef = collection(db, 'users', userID, 'shoes');
      const shortsRef = collection(db, 'users', userID, 'shorts');
      const socksRef = collection(db, 'users', userID, 'socks');
      //need to figure out orderBy() after seeing a wardrobe collection************************
      const qPants = query(pantsRef);
      const updatePants = onSnapshot(qPants, (querySnapshot) => {
        setUserPants(
          querySnapshot.docs.map((doc) => {
            return {
              ...doc.data()
            };
          })
        );
      });
      const qShirts = query(shirtsRef);
      const updateShirts = onSnapshot(qShirts, (querySnapshot) => {
        setUserShirts(
          querySnapshot.docs.map((doc) => {
            console.log(doc.data());
            return {
              ...doc.data()
            };
          })
        );
      });
      const qShoes = query(shoesRef);
      const updateShoes = onSnapshot(qShoes, (querySnapshot) => {
        setUserShoes(
          querySnapshot.docs.map((doc) => {
            return {
              ...doc.data()
            };
          })
        );
      });
      const qShorts = query(shortsRef);
      const updateShorts = onSnapshot(qShorts, (querySnapshot) => {
        setUserShorts(
          querySnapshot.docs.map((doc) => {
            return {
              ...doc.data()
            };
          })
        );
      });
      const qSocks = query(socksRef);
      const updateSocks = onSnapshot(qSocks, (querySnapshot) => {
        setUserSocks(
          querySnapshot.docs.map((doc) => {
            return {
              ...doc.data()
            };
          })
        );
      });
    }
  }, [userID]);

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
        {clothingType === 'shirts' && userShirts.map((shirts, index) => (
          <div key={shirts.id} className='bg-white rounded-lg shadow-xl p-8 mb-4'>
            {shirts.images.map((image, index) => (
              <img key={index} src={image} width={'auto'} />
            ))}
          </div>
        ))}
        {clothingType === 'pants' && userPants.map((pants, index) => (
          <div key={pants.id} className='bg-white rounded-lg shadow-xl p-8 mb-4'>
            {pants.images.map((image, index) => (
              <img key={index} src={image} width={'auto'} />
            ))}
          </div>
        ))}
        {clothingType === 'shorts' && userShorts.map((shorts, index) => (
          <div key={shorts.id} className='bg-white rounded-lg shadow-xl p-8 mb-4'>
            {shorts.images.map((image, index) => (
              <img key={index} src={image} width={'auto'} />
            ))}
          </div>
        ))}
        {clothingType === 'socks' && userSocks.map((socks, index) => (
          <div key={socks.id} className='bg-white rounded-lg shadow-xl p-8 mb-4'>
            {socks.images.map((image, index) => (
              <img key={index} src={image} width={'auto'} />
            ))}
          </div>
        ))}
        {clothingType === 'shoes' && userShoes.map((shoes, index) => (
          <div key={shoes.id} className='bg-white rounded-lg shadow-xl p-8 mb-4'>
            {shoes.images.map((image, index) => (
              <img key={index} src={image} width={'auto'} />
            ))}
          </div>
        ))}
      </div>
      
  </div>
);
          }
export default Dropzone;
