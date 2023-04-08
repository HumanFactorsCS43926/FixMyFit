import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth, upload } from "../firebase";
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Profile(){
    const currentUser = useAuth();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");

    function handleChange(e) {
        if (e.target.files[0]) {
          setPhoto(e.target.files[0])
        }
      }
    
      function handleClick() {
        upload(photo, currentUser, setLoading);
      }
    
      useEffect(() => {
        if (currentUser?.photoURL) {
          setPhotoURL(currentUser.photoURL);
        }
      }, [currentUser])

      updateDoc(doc(db, "users", currentUser.uid),{
        photoURL: currentUser.photoURL
    })
    
    return(
      <div className="fields">
        <input type="file" onChange={handleChange} />
        <button disabled={loading || !photo} onClick={handleClick}>Upload</button>
        <img src={photoURL} alt="Avatar" className="avatar" />
      </div>
    )
  
}

export default Profile;