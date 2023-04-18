import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth, upload } from "../firebase";
import { db } from '../firebase';
import { doc } from 'firebase/firestore';
import Dropzone from './dropzoneWar';
import './commentBox.css';
import './Profile.css';

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

      const [isShownShirts, setIsShownShirts] = useState(false);
      const [isShownPants, setIsShownPants] = useState(false);
      const [isShownShorts, setIsShownShorts] = useState(false);
      const [isShownSocks, setIsShownSocks] = useState(false);
      const [isShownShoes, setIsShownShoes] = useState(false);

      const [selectedClothingItem, setSelectedClothingItem] = useState(null);

      const showDropBox = (dropBoxType) => {
        if (dropBoxType === 'shirts') {
          setIsShownShirts(current => !current);
          setSelectedClothingItem(dropBoxType);
        } else if (dropBoxType === 'pants') {
          setIsShownPants(current => !current);
          setSelectedClothingItem(dropBoxType);
        } else if (dropBoxType === 'shorts') {
          setIsShownShorts(current => !current);
          setSelectedClothingItem(dropBoxType);
        } else if (dropBoxType === 'socks') {
          setIsShownSocks(current => !current);
          setSelectedClothingItem(dropBoxType);
        } else if (dropBoxType === 'shoes') {
          setIsShownShoes(current => !current);
          setSelectedClothingItem(dropBoxType);
        }
      };
    return(
      <div className="fields">
        <div className="pt-5 pb-2 mt-80" style={{ display: 'flex', flexDirection: 'column' }}>
          <img src={photoURL} alt="Avatar" className="avatar" style={{ marginBottom: '10px' }} />
            <input type="file" onChange={handleChange} />
        </div>
        <button disabled={loading || !photo} onClick={handleClick}>Upload</button>
        
        <div className="wardrobeBox">
          <div className="wardrobeIcon">
            <button onClick={() => showDropBox('shirts')}>
              <img className="wImage" src={require("./images/t-shirt_003.jpg")} width="150" height="150"/>
              <div className="wText">Shirts</div>
            </button>
              {isShownShirts &&(
                <Dropzone clothingType="shirts"/>
              )}
          </div>
          <div className="wardrobeIcon">
            <button onClick={() => showDropBox('pants')}>
              <img className="wImage bg-white" src={require("./images/icons-pantspng.png")} width="150" height="150"/>
              <div className="wText">Pants</div>
            </button>
              {isShownPants &&(
                <Dropzone clothingType="pants"/>
              )}
          </div>
          <div className="wardrobeIcon">
            <button onClick={() => showDropBox('shorts')}>
              <img className="wImage bg-white" src={require("./images/icon-shorts.png")} width="150" height="150"/>
              <div className="wText">Shorts</div>
            </button>
              {isShownShorts &&(
                <Dropzone clothingType="shorts"/>
              )}
          </div>
          <div className="wardrobeIcon">
            <button onClick={() => showDropBox('socks')}>
              <img className="wImage bg-white" src={require("./images/icon-socks.png")} width="150" height="150"/>
              <div className="wText">Socks</div>
            </button>
              {isShownSocks &&(
                <Dropzone clothingType="socks"/>
              )}
          </div>
          <div className="wardrobeIcon">
            <button onClick={() => showDropBox('shoes')}>
              <img className="wImage bg-white" src={require("./images/icon-shoes.png")} width="150" height="150"/>
              <div className="wText">Shoes</div>
            </button>
              {isShownShoes &&(
                <Dropzone clothingType="shoes"/>
              )}
          </div>
        </div>
      </div>
    )
  
}

export default Profile;