import React, { useEffect, useState, useRef } from 'react';
import {useAuth} from '../firebase';
import {  updateDoc, addDoc, collection, onSnapshot,orderBy,query } from 'firebase/firestore';
import { db } from "../firebase";
import moment from 'moment';
import './commentBox.css';

const Posts = () => {
    const[posts, setPosts] = useState([])
    const currentUser = useAuth();
    const postComment = useRef();
    const [userData, setUserData] = useState(null);
    useEffect(()=>{
        const collectionRef = collection(db,"post")
        const q = query(collectionRef,orderBy("timestamp","desc"))
        const unsubscribe = onSnapshot(q, (querySnapshot)=>{
          setPosts(querySnapshot.docs.map(doc => {
              console.log(doc.data()); // add this line to log the data object
              return {
                  ...doc.data(),
                  id: doc.id,
                  timestamp: doc.data().timestamp?.toDate().getTime(),
                  username: doc.data().userName?.userName
              }
          }));
      });

        return unsubscribe
    },[])

    const uploadComment = async (postId) => {
      const commentRef = collection(db,'post',postId, "comments")
      await addDoc(commentRef,{
        comment : postComment.current.value,
        username: currentUser.displayName,
      });
  }

  

    return (
        <div>
          {posts.map((post) => (
            <div key={post.id} className='bg-white rounded-lg shadow-xl p-8 w-1/2 m-auto mb-4'>

              <div className='text-base font-bold'>{post.userName?.userName}</div>
              <div className=' flex space-x-3'>
                {post.images.map((image, index) => (
                  <img key={index}  src={image} width={"200px"} />
                ))}
              </div>
              <div> <span className='text-base p font-bold'>{post.userName?.userName}</span>: {post.post} </div>

              <input className="comment-box" ref={postComment} type="text" placeholder='add a comment...'/>

              <button onClick={() => uploadComment(post.id)}>post</button>

              <p className='mt-3 text-xs text-right text-gray-400'>{moment(post.timestamp).fromNow()}</p>
            </div>
          ))}
        </div>
      )
              }
 export default Posts;
