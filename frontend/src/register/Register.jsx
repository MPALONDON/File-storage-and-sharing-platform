import Header from "../header/Header.jsx";
import RegisterForm from "./RegisterForm.jsx";

export default function Register(){
    return(
        <>
            <Header sidebar = "icon1" homepage="YouTube" signin= "Sign In" signout="Sign-out" userAccount="My account">


            </Header>
               <RegisterForm></RegisterForm>


        </>
    )
}