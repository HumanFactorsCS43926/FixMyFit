import React, { useState, useEffect, useRef } from 'react';
import "./SearchBar.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateDoc,serverTimestamp,getDoc,doc, addDoc, collection, onSnapshot, orderBy, query, increment, where, QuerySnapshot, getDocs } from 'firebase/firestore';
import AliceCarousel from 'react-alice-carousel';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';
import Outfit from './Outfit';

const SearchBar = ({placeholder, data}) => { 
  const [queriedUser, setQueriedUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [userPants, setUserPants] = useState([]);
  const [userShirts, setUserShirts] = useState([]);
  const [userShoes, setUserShoes] = useState([]);
  const [userShorts, setUserShorts] = useState([]);
  const [userSocks, setUserSocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [combinedSocks, setCombinedSocks] = useState([]);
  const [combinedPants, setCombinedPants] = useState([]);
  const [combinedShirts, setCombinedShirts] = useState([]);
  const [combinedShoes, setCombinedShoes] = useState([]);
  const [combinedShorts, setCombinedShorts] = useState([]);
  
  const auth = getAuth();
  const user = auth.currentUser;
  const [userID, setUserID] = useState('');

  const onDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.src);
  }

  const handleSearch = (event) => {
    event.preventDefault();
    setQueriedUser(searchQuery);
    const collectionRef = collection(db, 'users');
    const qUser = query(collectionRef, where("userName.userName", "==", searchQuery));
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

  useEffect(() => {
    const combinedPantsData = userPants.reduce((acc, pant) => {
      return [...acc, ...pant.images.filter(image => image !== '')]; // Concatenate images arrays
    }, []);
    setCombinedPants(combinedPantsData);
  }, [userPants]);

  useEffect(() => {
    const combinedShoesData = userShoes.reduce((acc, shoe) => {
      return [...acc, ...shoe.images.filter(image => image !== '')]; // Concatenate images arrays
    }, []);
    setCombinedShoes(combinedShoesData);
  }, [userShoes]);

  useEffect(() => {
    const combinedShirtsData = userShirts.reduce((acc, shirt) => {
      return [...acc, ...shirt.images.filter(image => image !== '')]; // Concatenate images arrays
    }, []);
    setCombinedShirts(combinedShirtsData);
  }, [userShirts]);


  useEffect(() => {
    const combinedShortsData = userShorts.reduce((acc, short) => {
      return [...acc, ...short.images.filter(image => image !== '')]; // Concatenate images arrays
    }, []);
    setCombinedShorts(combinedShortsData);
  }, [userShorts]);

  useEffect(() => {
    const combinedSocksData = userSocks.reduce((acc, sock) => {
      return [...acc, ...sock.images.filter(image => image !== '')]; // Concatenate images arrays
    }, []);
    setCombinedSocks(combinedSocksData);
  }, [userSocks]);

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
                    {post.images.filter((image) => image !== '') // Filter out empty images
              .map((image, index) => (
                <img onDragStart={onDragStart} draggable key={index} src={image} width={'auto'} style={{ marginTop: '10px' }} // Add margin-top style
                />
            ))}
                    </AliceCarousel>
                    <div>
                      <span className='text-base p font-bold'>{post.userName?.userName}</span>: {post.post}
                    </div>
                  </div>
                ))}
              </div>

              <div id='user_wardrobe'>

              { combinedShirts.length > 0 &&// Conditionally render if queriedUser is not empty and combinedShirts is not empty
                  <div className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                    <AliceCarousel>
                  {combinedShirts.filter((image) => image !== '').map((image, index) => (
                    <img onDragStart={onDragStart} draggable key={index} src={image} width={'auto'} alt={`Shirt ${index}`} className='w-full h-48 object-cover mb-2' />
                  ))}
                </AliceCarousel>
                    <div>
                      <span className='text-base p font-bold'>Shirts</span>
                    </div> 
                  </div>
                }
              { combinedPants.length > 0 &&// Conditionally render if queriedUser is not empty and combinedShirts is not empty
                  <div className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                    <AliceCarousel>
                  {combinedPants.filter((image) => image !== '').map((image, index) => (
                    <img onDragStart={onDragStart} draggable key={index} src={image} alt={`Pant ${index}`} className='w-full h-48 object-cover mb-2' />
                  ))}
                </AliceCarousel>
                    <div>
                      <span className='text-base p font-bold'>Pants</span>
                    </div> 
                  </div>
                }
              { combinedShorts.length > 0 &&// Conditionally render if queriedUser is not empty and combinedShirts is not empty
                  <div className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                    <AliceCarousel>
                  {combinedShorts.filter((image) => image !== '').map((image, index) => (
                    <img onDragStart={onDragStart} draggable key={index} src={image} alt={`Short ${index}`} className='w-full h-48 object-cover mb-2' />
                  ))}
                </AliceCarousel>
                    <div>
                      <span className='text-base p font-bold'>Shorts</span>
                    </div> 
                  </div>
                }
              { combinedSocks.length > 0 &&// Conditionally render if queriedUser is not empty and combinedShirts is not empty
                  <div className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                    <AliceCarousel>
                  {combinedSocks.filter((image) => image !== '').map((image, index) => (
                    <img onDragStart={onDragStart} draggable key={index} src={image} alt={`Sock ${index}`} className='w-full h-48 object-cover mb-2' />
                  ))}
                </AliceCarousel>
                    <div>
                      <span className='text-base p font-bold'>socks</span>
                    </div> 
                  </div>
                }
              { combinedShoes.length > 0 &&// Conditionally render if queriedUser is not empty and combinedShirts is not empty
                  <div className='bg-white rounded-lg shadow-xl p-8 mb-4' style={{ marginLeft: "10%", width: 'auto', maxWidth: '500px' ,minWidth: '200px'}}>
                    {/* <div className='text-base font-bold'>{post.userName?.userName}</div> */}
                    <AliceCarousel>
                  {combinedShoes.filter((image) => image !== '').map((image, index) => (
                    <img onDragStart={onDragStart} draggable key={index} src={image} alt={`Shoe ${index}`} className='w-full h-48 object-cover mb-2' />
                  ))}
                </AliceCarousel>
                    <div>
                      <span className='text-base p font-bold'>Shoes</span>
                    </div> 
                  </div>
              }
                
                
                
              </div>
              
              <div id='fit_template'>
                <Outfit />
              </div>
          </div>
        
        
        
        </>
      }

      

        </main>

  

  );
}

export default SearchBar