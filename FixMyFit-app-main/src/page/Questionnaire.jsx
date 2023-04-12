import React, {useState, useEffect} from 'react';
import Text from '../components/elements/Text';
import { NavLink, useNavigate } from 'react-router-dom';
import {  getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Profile from './Profile';



const Questionnaire = () => {
    const navigate = useNavigate();
    const [userSex, setUserSex] = useState('');

    function handleUserSex(event) {
        setUserSex(event.target.value);
    }

    const onSubmit = async (e) => {
      e.preventDefault()
        try{
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const userID = user.uid;
                    const userRef = db.collection('users').doc(userID);
                    const questionnaireRef = userRef.collection('questionnaires');
                    const formRef = document.getElementById("user-questionnaire");
                    formRef.addEventListener("submit", function(event) {
                    event.preventDefault();
                    const formData = {
                        sex: formRef.elements.sex.value,
                        height: formRef.elements.height.value,
                        weight: formRef.elements.weight.value,
                        body_type: formRef.elements.bodytype.value,
                        tshirt: formRef.elements.tshirt.value,
                        dress_shirt: formRef.elements.dressshirt.value,
                        pants: formRef.elements.pants.value,
                        shorts: formRef.elements.shorts.value,
                        shoes: formRef.elements.shoes.value,
                        hat: formRef.elements.hat.value,
                        coat: formRef.elements.coat.value,
                        shirt: formRef.elements.shirt.value,
                        jeans: formRef.elements.jeans.value,
                        bottoms: formRef.elements.bottoms.value,
                        dress: formRef.elements.dress.value,
                        bra: formRef.elements.bra.value,
                        work_frequency: formRef.elements.workfrequency.value,
                        formal_frequency: formRef.elements.formalfrequency.value,
                        casual_frequency: formRef.elements.casualfrequency.value,
                        athletic_frequency: formRef.elements.athleticfrequency.value,
                        social_frequency: formRef.elements.socialfrequency.value,
                        styles: formRef.elements.styles.value,
                        colors: formRef.elements.colors.value,
                        brands: formRef.elements.brands.value,
                    }
                    questionnaireRef.add(formData);
                    })
                    navigate("/home")
                    // ...
                    console.log("uid", userID)
                } else {
                    // User is signed out
                    // ...
                    console.log("user is logged out")
                }
                });
        }catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }
  
  return (
    <main > 
        <style>
        {`
            label{
                padding-left: 2px;
                padding-right: 10px;
            }
            form p {
                font-weight: bold;
            }
            form input[type='text'] {
                margin: 5px 0px 0px 0px;
            }
            form #male-clothing input[type='text'] {
                width: 50%;
            }
            form #female-clothing input[type='text'] {
                width: 50%;
            }
            button[type='submit']:hover {
                background-color: lightblue;
            }
            button[type='submit'] {
                background-color: #1e272e;
            }
            
            
        `}
        </style>       
        <section>
            <div className="flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <Text className="text-4xl text-white text-center font-bold mb-2">
                            FixMyFit
                        </Text>

                        <h2 className="text-white text-center text-base  tracking-tight text-gray-900">
                            Are you new? Fill out the questionnaire.
                        </h2>                        
                    </div>

                    
                    <form id="user-questionnaire" onSubmit={onSubmit} className="mt-8 space-y-6" style={{backgroundColor: "white"}} >                    
                        <div style={{height: "60vh",
                                overflow: "scroll",
                                margin: "10px 0px 0px 10px"
                                }} 
                                className=" space-y-6 rounded-md shadow-sm">

                            <p>Are you:</p>
                            <div>
                                <label htmlFor="male">
                                    <input value="male" name="sex" type="radio" checked={userSex === 'male'} onChange={handleUserSex}/> Male
                                </label>
                                <label htmlFor="male">
                                    <input value="female" name="sex" type="radio" checked={userSex === 'female'} onChange={handleUserSex}/> Female
                                </label>
                            </div>

                            <p>Height and weight:</p>
                            <div>
                                <label htmlFor="height">
                                    Height 
                                    <input 
                                        name="height" 
                                        type="text" 
                                        required 
                                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        style={{width: "25%"}}
                                    />
                                </label>
                                <label htmlFor="weight">
                                    Weight 
                                    <input 
                                        name="weight" 
                                        type="text" 
                                        required 
                                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        style={{width: "25%"}}
                                    />
                                </label>
                            </div>

                            <p>Body type:</p>
                            {userSex === 'male' &&
                                <>
                                    <div id="male-body">
                                        <label htmlFor="bodytype">
                                            <input value="slim" name="bodytype" type="radio"/> Slim
                                        </label>
                                        <label htmlFor="bodytype">
                                            <input value="athletic" name="bodytype" type="radio"/> Athletic 
                                        </label>
                                        <label htmlFor="bodytype">
                                            <input value="average" name="bodytype" type="radio"/> Average
                                        </label>
                                        <label htmlFor="bodytype">
                                            <input value="stocky" name="bodytype" type="radio"/> Stocky 
                                        </label>
                                        <label htmlFor="bodytype">
                                            <input value="heavy" name="bodytype" type="radio"/> Heavy 
                                        </label>
                                    </div>
                                </>
                            }
                            {userSex == 'female' && 
                                <>
                                    <div id="female-body">
                                        <label htmlFor="bodytype">
                                            <input value="slim" name="bodytype" type="radio"/> Slim 
                                        </label>
                                        <label htmlFor="bodytype">
                                            <input value="athletic" name="bodytype" type="radio"/> Athletic 
                                        </label>
                                        <label htmlFor="bodytype">
                                            <input value="average" name="bodytype" type="radio"/> Average
                                        </label>
                                        <label htmlFor="bodytype">
                                            <input value="curvy" name="bodytype" type="radio"/> Curvy 
                                        </label>
                                        <label htmlFor="bodytype">
                                            <input value="full-figured" name="bodytype" type="radio"/> Full-figured 
                                        </label>
                                    </div>
                                </>
                            }
                            
                            <p>Clothing sizes:</p>
                            {userSex === 'male' && 
                                <>
                                    <div id="male-clothing">
                                        <label htmlFor="tshirt">
                                            T-shirt
                                            <input 
                                                name="tshirt" 
                                                type="text" 
                                                placeholder="Ex. large"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="dressshirt">
                                            Dress shirt
                                            <input 
                                                name="dressshirt" 
                                                type="text" 
                                                placeholder="Ex. 16 / 34-35"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="pants">
                                            Pants
                                            <input 
                                                name="pants" 
                                                type="text" 
                                                placeholder="Ex. 32 / 32"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="shorts">
                                            Shorts
                                            <input 
                                                name="shorts" 
                                                type="text" 
                                                placeholder="Ex. Large"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="shoes">
                                            Shoes
                                            <input 
                                                name="shoes" 
                                                type="text" 
                                                placeholder="Ex. 11"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="hat">
                                            Hat
                                            <input 
                                                name="hat" 
                                                type="text" 
                                                placeholder="Ex. 7 1/2"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="coat">
                                            Coat
                                            <input 
                                                name="coat" 
                                                type="text" 
                                                placeholder="Ex. 38 regular"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                    </div>
                                </>
                            }
                            {userSex === 'female' &&
                                <>
                                    <div id="female-clothing">
                                        <label htmlFor="shirt">
                                            Shirt/Blouse
                                            <input 
                                                name="shirt" 
                                                type="text" 
                                                placeholder="Ex. Small 2-4"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="jeans">
                                            Jeans
                                            <input 
                                                name="jeans" 
                                                type="text" 
                                                placeholder="Ex. Waist 26"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="bottoms">
                                            Bottoms
                                            <input 
                                                name="bottoms" 
                                                type="text" 
                                                placeholder="Ex. Small 2-4"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="dress">
                                            Dress
                                            <input 
                                                name="dress" 
                                                type="text" 
                                                placeholder="Ex. Small 2-4"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="bra">
                                            Bra
                                            <input 
                                                name="bra" 
                                                type="text" 
                                                placeholder="Ex. 32 C"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="hat">
                                            Hat
                                            <input 
                                                name="hat" 
                                                type="text" 
                                                placeholder="Ex. 6 7/8"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                        <label htmlFor="shoes">
                                            Shoes
                                            <input 
                                                name="shoes" 
                                                type="text" 
                                                placeholder="Ex. 7"
                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </label>
                                    </div>
                                </>
                            }
                            

                            <p>How often do you dress for the following occasions?:</p>
                            <div>
                                <ul style={{listStyleType: "none"}}>
                                    <li>
                                        Work:
                                        <div 
                                            style={{display: "inline-block", verticalAlign: "middle", marginLeft: "10px"}}>
                                            <input type="radio" name='workfrequency' value="daily" />
                                            <label htmlFor="workfrequency">Daily</label>
                                            <input type="radio" name='workfrequency' value="often" />
                                            <label htmlFor="workfrequency">Often</label>
                                            <input type="radio" name='workfrequency' value="sometimes" />
                                            <label htmlFor="workfrequency">Sometimes</label>
                                            <input type="radio" name='workfrequency' value="never" />
                                            <label htmlFor="workfrequency">Never</label>
                                        </div>
                                    </li>
                                    <li>
                                        Formal Events:
                                        <div 
                                            style={{display: "inline-block", verticalAlign: "middle", marginLeft: "10px"}}>
                                            <input type="radio" name='formalfrequency' value="daily" />
                                            <label htmlFor="formalfrequency">Daily</label>
                                            <input type="radio" name='formalfrequency' value="often" />
                                            <label htmlFor="formalfrequency">Often</label>
                                            <input type="radio" name='formalfrequency' value="sometimes" />
                                            <label htmlFor="formalfrequency">Sometimes</label>
                                            <input type="radio" name='formalfrequency' value="never" />
                                            <label htmlFor="formalfrequency">Never</label>
                                        </div>
                                    </li>
                                    <li>
                                        Casual:
                                        <div 
                                            style={{display: "inline-block", verticalAlign: "middle", marginLeft: "10px"}}>
                                            <input type="radio" name='casualfrequency' value="daily" />
                                            <label htmlFor="casualfrequency">Daily</label>
                                            <input type="radio" name='casualfrequency' value="often" />
                                            <label htmlFor="casualfrequency">Often</label>
                                            <input type="radio" name='casualfrequency' value="sometimes" />
                                            <label htmlFor="casualfrequency">Sometimes</label>
                                            <input type="radio" name='casualfrequency' value="never" />
                                            <label htmlFor="casualfrequency">Never</label>
                                        </div>
                                    </li>
                                    <li>
                                        Athletic:
                                        <div 
                                            style={{display: "inline-block", verticalAlign: "middle", marginLeft: "10px"}}>
                                            <input type="radio" name='athleticfrequency' value="daily" />
                                            <label htmlFor="athleticfrequency">Daily</label>
                                            <input type="radio" name='athleticfrequency' value="often" />
                                            <label htmlFor="athleticfrequency">Often</label>
                                            <input type="radio" name='athleticfrequency' value="sometimes" />
                                            <label htmlFor="athleticfrequency">Sometimes</label>
                                            <input type="radio" name='athleticfrequency' value="never" />
                                            <label htmlFor="athleticfrequency">Never</label>
                                        </div>
                                    </li>
                                    <li>
                                        Date Night/Social Event:
                                        <div 
                                            style={{display: "inline-block", verticalAlign: "middle", marginLeft: "10px"}}>
                                            <input type="radio" name='socialfrequency' value="daily" />
                                            <label htmlFor="socialfrequency">Daily</label>
                                            <input type="radio" name='socialfrequency' value="often" />
                                            <label htmlFor="socialfrequency">Often</label>
                                            <input type="radio" name='socialfrequency' value="sometimes" />
                                            <label htmlFor="socialfrequency">Sometimes</label>
                                            <input type="radio" name='socialfrequency' value="never" />
                                            <label htmlFor="socialfrequency">Never</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <p>What is your preferred style(s)?:</p>
                            <div>
                                <label 
                                    htmlFor="classic" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='classic' 
                                        name='styles[]' 
                                        value="classic" /> Classic
                                </label>
                                <label 
                                    htmlFor="casual" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='casual' 
                                        name='styles[]' 
                                        value="casual" /> Casual
                                </label>
                                <label 
                                    htmlFor="sporty" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='sporty' 
                                        name='styles[]' 
                                        value="sporty" /> Sporty
                                </label>
                                <label 
                                    htmlFor="bohemian" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='bohemian' 
                                        name='styles[]' 
                                        value="bohemian" /> Bohemian
                                </label>
                                <label 
                                    htmlFor="vintage" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='vintage' 
                                        name='styles[]' 
                                        value="vintage" /> Vintage
                                </label>
                                <label 
                                    htmlFor="preppy" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='preppy' 
                                        name='styles[]' 
                                        value="preppy" /> Preppy
                                </label>
                                <label 
                                    htmlFor="hipster" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='hipster' 
                                        name='styles[]' 
                                        value="hipster" /> Hipster
                                </label>
                                <label 
                                    htmlFor="minimalist" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='minimalist' 
                                        name='styles[]' 
                                        value="minimalist" /> Minimalist
                                </label>
                                <label 
                                    htmlFor="streetwear" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='streetwear' 
                                        name='styles[]' 
                                        value="streetwear" /> Streetwear
                                </label>
                                <label htmlFor="other">
                                    <input 
                                        type="text" 
                                        id='other' 
                                        name='styles[]' 
                                        placeholder='other'/> Other
                                </label>  
                            </div>
                            
                            <p>What colors do you like to wear?:</p>
                            <div>
                                <label 
                                    htmlFor="white" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}}
                                        type="checkbox" 
                                        id='white' 
                                        name='colors[]' 
                                        value="white" /> White
                                </label>
                                <label 
                                    htmlFor="black" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}} 
                                        type="checkbox" 
                                        id='black' 
                                        name='colors[]' 
                                        value="black" /> Black
                                </label>
                                <label 
                                    htmlFor="gray" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}} 
                                        type="checkbox" 
                                        id='gray' 
                                        name='colors[]' 
                                        value="gray" /> Gray
                                </label>
                                <label 
                                    htmlFor="navy" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}} 
                                        type="checkbox" 
                                        id='navy' 
                                        name='colors[]' 
                                        value="navy" /> Navy Blue
                                </label>
                                <label 
                                    htmlFor="red" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}} 
                                        type="checkbox" 
                                        id='red' 
                                        name='colors[]' 
                                        value="red" /> Red
                                </label>
                                <label 
                                    htmlFor="green" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}} 
                                        type="checkbox" 
                                        id='green' 
                                        name='colors[]' 
                                        value="green" /> Green
                                </label>
                                <label 
                                    htmlFor="blue" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}} 
                                        type="checkbox" 
                                        id='blue' 
                                        name='colors[]' 
                                        value="blue" /> Blue
                                </label>
                                <label 
                                    htmlFor="brown" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}} 
                                        type="checkbox" 
                                        id='brown' 
                                        name='colors[]' 
                                        value="brown" /> Brown
                                </label>
                                <label 
                                    htmlFor="pink" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}} 
                                        type="checkbox" 
                                        id='pink' 
                                        name='colors[]' 
                                        value="pink" /> Pink
                                </label>
                                <label 
                                    htmlFor="yellow" 
                                    style={{display: "block"}}>
                                    <input 
                                        style={{display: "inline-block"}} 
                                        type="checkbox" 
                                        id='yellow' 
                                        name='colors[]' 
                                        value="yellow" /> Yellow
                                </label>
                                <label htmlFor="other-color-1">
                                    <input 
                                        type="text" 
                                        id='other-color-1' 
                                        name='colors[]' 
                                        /> Other
                                </label>
                                <label htmlFor="other-color-2">
                                    <input 
                                        type="text" 
                                        id='other-color-2' 
                                        name='colors[]' 
                                        /> Other
                                </label> 
                                <label htmlFor="other-color-3">
                                    <input 
                                        type="text" 
                                        id='other-color-3' 
                                        name='colors[]' 
                                        /> Other
                                </label>   
                            </div> 

                            <p>Do you have any specific brands that you prefer?</p>
                            <div>
                                <textarea 
                                    name="brands" 
                                    id="brands" 
                                    cols="30" 
                                    rows="10"
                                    placeholder='Ex. Vans, Hollister, Forever 21, Lane Bryant'></textarea>
                            </div>
                            
                        </div>                        

                        <div>
                            <button
                                type="submit"                                                               
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >   
                                Finish                                                             
                            </button>
                        </div>
                                             
                    </form>
                   

                    
                    
                </div>
            </div>
        </section>
    </main>
  )
}

export default Questionnaire