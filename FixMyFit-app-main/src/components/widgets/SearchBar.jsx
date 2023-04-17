import React, { useState, useEffect, useRef } from 'react';
import "./SearchBar.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateDoc,serverTimestamp,getDoc,doc, addDoc, collection, onSnapshot, orderBy, query, increment, where, QuerySnapshot, getDocs } from 'firebase/firestore';
import AliceCarousel from 'react-alice-carousel';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';

const SearchBar = ({placeholder, data}) => { 
  const [queriedUser, setQueriedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [userWardrobe, setUserWardrobe] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;


  function handleSearch (event) {
    event.preventDefault();
    setQueriedUser(searchQuery);
    setIsLoading(true);
    
    
  }

  useEffect(() => {
    const collectionRef = collection(db, 'post');
    const q = query(collectionRef, where("userName.userName", "==", queriedUser));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUserPosts(
        querySnapshot.docs.map((doc) => {
          return {
            ...doc.data()
          };
        })
      );
      setIsLoading(false);
    });
  }, [queriedUser]);



   
   //pulls user posts
  //  useEffect(() => {
    
  //   return unsubscribe;
  // }, []);

  // //pulls user wardrobe
  // useEffect(() => {
  //   const userDocRef = doc(db, 'users', user.uid);
  //   const wardrobeRef = collection(userDocRef, 'wardrobe');
  //   //need to figure out orderBy() after seeing a wardrobe collection************************
  //   const q = query(wardrobeRef, orderBy());
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     setUserWardrobe(
  //       querySnapshot.docs.map((doc) => {
  //         return {
  //           ...doc.data()
  //         };
  //       })
  //     );
  //   });
  //   return unsubscribe;
  // }, []);

  return (
    <main>
      <style>
        {`
          form {
            display: flex;
          }
  
          form input, button {
            display: inline-block;
            margin-right: 10px;
          }
  
          .searchContainer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          
          #user_posts {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: flex-start;
          }
          
          .postContainer {
            margin: 0 10px;
            width: auto;
            max-width: 500px;
            min-width: 200px;
          }
          
          .post {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
            padding: 20px;
            margin-bottom: 20px;
          }
          
          .postHeader {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .postImages {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .postImage {
            width: 100%;
            max-width: 300px;
            height: auto;
          }
          
          .postContent {
            font-size: 16px;
          }
        `}
      </style>
      <div className="searchContainer">
        <div className="search">
          <div className="searchInputs">
            <form onSubmit={handleSearch}>
              <input type="text" placeholder={placeholder} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type='submit'
                className='relative flex text-xl font-medium text-white' disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Search'}
              </button>
            </form>
          </div>
          <div className="dataResult"></div>
        </div>
        {queriedUser !== '' && 
          <div id='user_posts'>
            {userPosts.map((post, index) => (
              <div key={post.id} className='postContainer'>
                <div className='post'>
                  <div className='postHeader'>{post.userName?.userName}</div>
                  <div className='postImages'>
                    <AliceCarousel>
                      {post.images.map((image, index) => (
                        <img key={index} src={image} className='postImage' />
                      ))}
                    </AliceCarousel>
                  </div>
                  <div className='postContent'>
                    <span className='font-bold'>{post.userName?.userName}</span>: {post.post}
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </main>
  );
}

export default SearchBar