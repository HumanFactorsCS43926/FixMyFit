import React, { useState, useEffect, useRef } from 'react';
import "./SearchBar.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateDoc,serverTimestamp,getDoc,doc, addDoc, collection, onSnapshot, orderBy, query, increment, where, QuerySnapshot } from 'firebase/firestore';
import AliceCarousel from 'react-alice-carousel';
import { db } from '../../firebase';

const SearchBar = ({placeholder, data}) => { 
   const [queriedUser, setQueriedUser] = useState(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [userPosts, setUserPosts] = useState([]);



   const handleSearch = (event) => {
    event.preventDefault();
    setQueriedUser(searchQuery);

    

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
    });
    return unsubscribe;
  }, []);

  return (
    <main>
      <style>
      </style>
      <div className="search">
        <div className="searchInputs">
          <form onSubmit={handleSearch}>
            <input type="text" placeholder={placeholder} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type='submit'
              className='relative flex text-sm font-medium text-white'>Search</button>
          </form>
        </div>
        <div className="dataResult"></div>
      </div>


      {queriedUser !== '' && 
        <>
          <div className='container'>
              <div id='user_posts'>
                {userPosts.map((post, index) => (
                  <div key={post.id} className='bg-white rounded-lg shadow-xl p-8   mb-4'style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    <div className='text-base font-bold'>{post.userName?.userName}</div>
                    <AliceCarousel>
                      {post.images.map((image, index) => (
                        <img key={index} src={image} width={'auto'} />
                      ))}
                    </AliceCarousel>
                        
                    <div>
                      <span className='text-base p font-bold'>{post.userName?.userName}</span>: {post.post}
                    </div>
            
                  </div>
                ))}
              </div>
              <div id='user_wardrobe'>

              </div>
              <div id='fit_template'>

              </div>
          </div>
        
        
        
        </>
      }

      

        </main>

  

  );
}

export default SearchBar