import React, { useEffect, useState } from 'react';
import {useAuth} from '../firebase';
import {  collection, onSnapshot,orderBy,query } from 'firebase/firestore';
import { db } from "../firebase";
import moment from 'moment';

const Posts = () => {
    const[posts, setPosts] = useState([])
    useEffect(()=>{
        const collectionRef = collection(db,"post")
        const q = query(collectionRef,orderBy("timestamp","desc"))
        const unsubscribe = onSnapshot(q, (querySnapshot)=>{
            setPosts(querySnapshot.docs.map(doc => ({...doc.data(),id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime() })))
        })

        return unsubscribe
    },[])

  

    return (
        <div>
          {posts.map((post) => (
            <div key={post.id} className='bg-white rounded-lg shadow-xl p-8 w-1/2 m-auto mb-4'>

              <div className='text-lg'>{post.post}</div>
              <div className='flex space-x-3'>
                {post.images.map((image, index) => (
                  <img key={index}  src={image} width={"200px"} />
                ))}
              </div>
              <p className='mt-3 text-xs text-right text-gray-400'>{moment(post.timnestamp).fromNow()}</p>
            </div>
          ))}
        </div>
      )
              }
 export default Posts;
