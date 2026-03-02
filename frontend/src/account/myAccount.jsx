import Header from "../header/Header.jsx";
import {useParams} from "react-router-dom";
import UploadForm from "../User/UploadForm.jsx";
import UserChannel from "../User/UserChannel.jsx";
import {useEffect, useState} from "react";

export default function myAccount(){

    const [currentUser, setCurrentUser] = useState({})


    useEffect(()=>{
        const fetchData = async ()=>{
        const response = await fetch("http://localhost:8000/username", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
        credentials: "include"
        }

    )
            if (response.ok){

      const data = await response.json()
            setCurrentUser(data)
            }

    };
    fetchData()
    },[])

    const {username} = useParams();

    return (<>


         <Header sidebar = "icon1" homepage="YouTube" signin= "Sign In" signout="Sign-out" userAccount="My account">

         </Header>
            
            {currentUser?.username === username ? <UploadForm>


                </UploadForm>
                
            :
               <UserChannel>

            </UserChannel>
            }

        </>

    )
}