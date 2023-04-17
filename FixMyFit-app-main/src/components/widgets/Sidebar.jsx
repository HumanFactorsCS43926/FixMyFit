import React from 'react';
import Button from '../elements/Button';
import Text from '../elements/Text';
import {  signOut } from "firebase/auth";
import {auth} from '../../firebase';
import {NavLink} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");  
        }).catch((error) => {
            toast.error(error, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            toast.clearWaitingQueue();
        });

    }


  return (
    <aside className="text-white">
        <ToastContainer limit={1}/>
        <ul>
            <Text className="text-lg pl-4 mt-6 font-bold mb-9 mx-4">
               FixMyFit
            </Text>

            <NavLink 
                    to="/ProfilePage"
                    className={({isActive}) => 
                        isActive? "bg-secondary w-full block border-l-2 border-l-tertiary mr-2 py-3  text-sm"
                        : 
                        "mr-2 text-sm py-3 "
                    }    
                >                    
                    <li className="p-4 mx-4 ">
                        Profile
                    </li>
                </NavLink>

                <NavLink 
                    to="/SearchPage"
                    className={({isActive}) => 
                        isActive? "bg-secondary w-full block border-l-2 border-l-tertiary mr-2 py-3  text-sm"
                        : 
                        "mr-2 text-sm py-3 "
                    }    
                >                    
                    <li className="p-4 mx-4 ">
                        Search
                    </li>
                </NavLink>

                <NavLink 
                    to="/home"
                    className={({isActive}) => 
                        isActive? "bg-secondary w-full block border-l-2 border-l-tertiary mr-2 py-3  text-sm"
                        : 
                        "mr-2 text-sm py-3 "
                    }    
                >                    
                    <li className="p-4 mx-4">
                        Home
                    </li>
                </NavLink>
            
                <NavLink 
                    to="/notes"
                    className={({isActive}) => 
                        isActive? "bg-secondary w-full block border-l-2 border-l-tertiary mr-2 py-3  text-sm"
                        : 
                        "mr-2 text-sm py-3 pl-4"
                    }     
                >
                    <li className="p-4 mx-4">
                        Create Post +
                    </li>                    
                </NavLink>
                <nav className="flex justify-between pt-6 pl-4 pr-4">
                    <Button onClick={handleLogout} className="py-1 px-6 ">
                        Logout
                    </Button>
                </nav>   
        </ul>
    </aside>

    
  )
}

export default Sidebar