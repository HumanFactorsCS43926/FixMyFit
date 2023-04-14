import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../firebase';
import { updateDoc,serverTimestamp,getDoc,doc, addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import moment from 'moment';
import './commentBox.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const currentUser = useAuth();
  const postComments = useRef([]);
  const [userData, setUserData] = useState(null);
  const [commentSubscriptions, setCommentSubscriptions] = useState({});

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

  useEffect(() => {
    const collectionRef = collection(db, 'post');
    const q = query(collectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => {
          console.log(doc.data()); // add this line to log the data object
          return {
            ...doc.data(),
            id: doc.id,
            timestamp: doc.data().timestamp?.toDate().getTime(),
            username: doc.data().userName?.userName,
          };
        })
      );
    });

    return unsubscribe;
  }, []);

  const uploadComment = async (postId, postIndex) => {
    const commentRef = collection(db, 'post', postId, 'comments');
    await addDoc(commentRef, {
      comment: postComments.current[postIndex].value,
      username: userData.userName,
      timestamp: serverTimestamp(),
    });

    postComments.current[postIndex].value = '';
  };

  const getComment = async (postId) => {
    const collection2Ref = collection(db, 'post', postId, 'comments');
    const q = query(collection2Ref, orderBy('timestamp', 'desc'));

    // Subscribe to the query and store the subscription
    const subscription = onSnapshot(q, (querySnapshot) => {
      setComments(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate().getTime(),
          username: doc.data().username,
          comment: doc.data().comment,
        }))
      );
    });
    
    setCommentSubscriptions((prevSubscriptions) => ({
      ...prevSubscriptions,
      [postId]: subscription,
    }));
  };

  useEffect(() => {
    getUserData();

    // Unsubscribe from all comment subscriptions when component unmounts
    return () => {
      Object.values(commentSubscriptions).forEach((subscription) => subscription());
    };
  }, [currentUser]);

  return (
    <div>
      {posts.map((post, index) => (
        <div key={post.id} className='bg-white rounded-lg shadow-xl p-8 w-1/2 m-auto mb-4'>
          <div className='text-base font-bold'>{post.userName?.userName}</div>
          <div className=' flex space-x-3'>
            {post.images.map((image, index) => (
              <img key={index} src={image} width={'200px'} />
            ))}
          </div>
          <div>
            <span className='text-base p font-bold'>{post.userName?.userName}</span>: {post.post}
          </div>
  
          <input className='comment-box' ref={(el) => (postComments.current[index] = el)} type='text' placeholder='add a comment...' />
  
          <button onClick={() => uploadComment(post.id, index)}>post</button>
  
          <button onClick={() => getComment(post.id)}>showcomments</button>
          {comments.map((comment) => (
  <div key={comment.id} className='bg-white rounded-lg shadow-xl p-8 w-1/2 m-auto mb-4'>
    <div>
      <span className='text-base p font-bold'>{comment.username.userName}</span>: {comment.comment}
      <p className='mt-3 text-xs text-right text-gray-400'>{moment(comment.timestamp).fromNow()}</p>
    </div>
  </div>
))}
  
          <p className='mt-3 text-xs text-right text-gray-400'>{moment(post.timestamp).fromNow()}</p>
        </div>
      ))}
    </div>
  );
};

export default Posts;