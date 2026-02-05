import Header from "../header/Header.jsx";
import {useParams} from "react-router-dom";
import UploadForm from "../User/UploadForm.jsx";
import UserChannel from "../User/UserChannel.jsx";
import {useEffect, useState} from "react";

export default function myAccount(){

    const [DbUser, setDbUser] = useState({})

    const token = localStorage.getItem("token")

    useEffect(()=>{
        const fetchData = async ()=>{
        const response = await fetch("http://127.0.0.1:8000/username", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }}

    )
      const data = await response.json()
            setDbUser(data)

    };
    fetchData()
    },[])

    const {username} = useParams();

    return (<>


         <Header sidebar = "icon1" homepage="YouTube" signin= "Sign In" signout="Sign-out" userAccount="My account">

         </Header>
            {DbUser?.username === username ? <UploadForm>


                </UploadForm>
                
            :
               <UserChannel>

            </UserChannel>
            }

        </>

    )
}