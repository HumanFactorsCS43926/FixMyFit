import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth, upload } from "../firebase";
import { db } from '../firebase';
import { doc } from 'firebase/firestore';
import './commentBox.css';

function Profile(){
    const currentUser = useAuth();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");

    function handleChange(e) {
        if (e.target.files[0]) {
          setPhoto(e.target.files[0])
        }
        updateDoc(doc(db, "users", currentUser.uid),{
          photoURL: currentUser.photoURL
        })
      }
    
      function handleClick() {
        upload(photo, currentUser, setLoading);
      }
    
      useEffect(() => {
        if (currentUser?.photoURL) {
          setPhotoURL(currentUser.photoURL);
        }
      }, [currentUser])
    return(
      <div className="fields">
  <div className="pt-5 pb-2 mt-80" style={{ display: 'flex', flexDirection: 'column' }}>
    <img src={photoURL} alt="Avatar" className="avatar" style={{ marginBottom: '10px' }} />
    <input type="file" onChange={handleChange} />
  </div>
  <button disabled={loading || !photo} onClick={handleClick}>Upload</button>
</div>


    )
  
}

export default Profile;