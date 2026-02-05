import SignInForm from "./SignInForm.jsx";
import Header from "../header/Header.jsx";

export default function SignIn(){
    return(
        <>
            <Header sidebar = "icon1" homepage="YouTube" signin= "Sign In" signout="Sign-out" userAccount="My account">

            </Header>
                <SignInForm>

                </SignInForm>


        </>
    )
}