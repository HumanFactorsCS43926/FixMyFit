import React from 'react';
import Button from '../elements/Button';
import Text from '../elements/Text';
import {  signOut } from "firebase/auth";
import {auth} from '../../firebase';
import {NavLink} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
                

        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });

    }


  return (
    <aside className="text-white">
        <ul>
            <Text className="text-lg pl-4 mt-6 font-bold mb-12">
               FixMyFit
            </Text>

                <NavLink 
                    to="/SearchPage"
                    className={({isActive}) => 
                        isActive? "bg-secondary w-full block border-l-2 border-l-tertiary mr-2 py-3  text-sm"
                        : 
                        "mr-2 text-sm py-3 "
                    }    
                >                    
                    <li className="p-4 ">
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
                    <li className="p-4 ">
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
                    <li className="p-4">
                        Notes
                    </li>                    
                </NavLink>
                <nav className="flex justify-between pt-8">
                    <Button onClick={handleLogout} className="py-1 px-6">
                        Logout
                    </Button>
                </nav>   
        </ul>
    </aside>
  )
}

export default Sidebar