import React, {useState} from 'react';
import Text from '../components/elements/Text';
import {  signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { auth, db } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user.uid);
            var qRef = doc(db, "questionnaires", user.uid);
            getDoc(qRef).then((doc) => {
                if (doc.exists()) {
                    navigate('/home');
                    console.log("doc exists");
                } else {
                    navigate('/questionnaire');
                    console.log("doc doesn't exist");
                }
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //console.log(errorCode, errorMessage)
            toast.error('Wrong email or password. Try Again', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            console.log(errorCode, errorMessage)
            toast.clearWaitingQueue();
        });
        
    }

    return(
        <>
            <main >        
                <section>
                <ToastContainer limit={1}/>
                    <div className="flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
                        <div className="w-full max-w-md space-y-8">
                            <div>
                                <Text className="text-4xl text-white text-center font-bold mb-2">
                                    FixMyFit
                                </Text>

                                <h2 className="text-white text-center text-base  tracking-tight text-gray-900">
                                    Welcome,
                                </h2>                        
                            </div>
                            
                            <form className="mt-8 space-y-6" >                            
                                <div className=" space-y-6 rounded-md shadow-sm">
                                                                            
                                    
                                    <div>
                                        <label htmlFor="email-address" className="sr-only">
                                        Email address
                                        </label>
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="email"                                    
                                            required                                            
                                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Email address"
                                            onChange={(e)=>setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="sr-only">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"                                    
                                            required                                            
                                            className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Password"
                                            onChange={(e)=>setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>                        

                                <div>
                                    <button                                     
                                        onClick={onLogin}
                                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >      
                                        Login                                                                  
                                    </button>
                                </div>
                                
                            </form>
                        
                            <p className="text-sm text-white text-center">
                                No account yet?{' '}
                                <NavLink to="/" className="underline text-tertiary">
                                    Sign up
                                </NavLink>
                            </p>
                            
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Login