import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { db, storage, useAuth } from '../firebase';
import {
  addDoc,
  getDoc,
  arrayUnion,
  updateDoc,
  doc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from '@firebase/storage';

export default function Dropzone() {
  const currentUser = useAuth();
  const [selectedImages, setSelectedImages] = useState([]);
  const [userData, setUserData] = useState(null); // state to store user data
  const postRef = useRef(null);

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
      selectedImages.map((image) => {
        const imageRef = ref(
          storage,
          `post/${docRef.id}/${image.path}`
        );
        uploadBytes(imageRef, image, 'data_url').then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, 'post', docRef.id), {
            images: arrayUnion(downloadURL),
          });
        });
      })
    );
    postRef.current.value = '';
    setSelectedImages([]);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImages(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          downloadURL: '',
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const selected_images = selectedImages?.map((file) => (
    <div>
      <img src={file.preview} style={{ width: '200px' }} alt="" />
    </div>
  ));

  const isUploadDisabled = selectedImages.length === 0;

  useEffect(() => {
    getUserData();
  }, [currentUser]);

  return (
    <div>
      <input ref={postRef} type="text" placeholder="enter a post" />
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drop the the files here</p>
      </div>
      <button onClick={uploadPost} disabled={isUploadDisabled}>
      </button>
      {selected_images}
    </div>
  );
}

