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
  const [userPants, setUserPants] = useState([]);
  const [userShirts, setUserShirts] = useState([]);
  const [userShoes, setUserShoes] = useState([]);
  const [userShorts, setUserShorts] = useState([]);
  const [userSocks, setUserSocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = getAuth();
  const user = auth.currentUser;
  const [userID, setUserID] = useState('');


  function handleSearch (event) {
    event.preventDefault();
    setQueriedUser(searchQuery);
    const collectionRef = collection(db, 'users');
    const qUser = query(collectionRef, where("email.email", "==", "maldonado.nico12@gmail.com"));
    getDocs(qUser).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUserID(doc.id);
      });
    });
    console.log(userID);
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


  //pulls user wardrobe
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
          .container {
            display: flex;
            width: 100%;
            overflow: hidden;
          }
          #user_posts, #user_wardrobe {
            display: inline-block;
          }
        `}

      </style>
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
        <>
          <div className='container'>

              <div id='user_posts'>
                {userPosts.map((post, index) => (
                  <div key={post.id} className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
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
              {userShirts.map((shirts, index) => (
                <div key={shirts.id} className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                  {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                  <AliceCarousel>
                    {shirts.images.map((image, index) => (
                      <img key={index} src={image} width={'auto'} />
                    ))}
                  </AliceCarousel>
                  {/* <div>
                    <span className='text-base p font-bold'>{post.userName?.userName}</span>: {post.post}
                  </div> */}
                </div>
              ))}
              {userPants.map((pants, index) => (
                  <div key={pants.id} className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                    <AliceCarousel>
                      {pants.images.map((image, index) => (
                        <img key={index} src={image} width={'auto'} />
                      ))}
                    </AliceCarousel>
                    {/* <div>
                      <span className='text-base p font-bold'>{post.userName?.userName}</span>: {post.post}
                    </div> */}
                  </div>
                ))}

                {userShoes.map((shoes, index) => (
                  <div key={shoes.id} className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                    <AliceCarousel>
                      {shoes.images.map((image, index) => (
                        <img key={index} src={image} width={'auto'} />
                      ))}
                    </AliceCarousel>
                    {/* <div>
                      <span className='text-base p font-bold'>{post.userName?.userName}</span>: {post.post}
                    </div> */}
                  </div>
                ))}
                {userShorts.map((shorts, index) => (
                  <div key={shorts.id} className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                    <AliceCarousel>
                      {shorts.images.map((image, index) => (
                        <img key={index} src={image} width={'auto'} />
                      ))}
                    </AliceCarousel>
                    {/* <div>
                      <span className='text-base p font-bold'>{post.userName?.userName}</span>: {post.post}
                    </div> */}
                  </div>
                ))}
                {userSocks.map((socks, index) => (
                  <div key={socks.id} className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                    <AliceCarousel>
                      {socks.images.map((image, index) => (
                        <img key={index} src={image} width={'auto'} />
                      ))}
                    </AliceCarousel>
                    {/* <div>
                      <span className='text-base p font-bold'>{post.userName?.userName}</span>: {post.post}
                    </div> */}
                  </div>
                ))}
                
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