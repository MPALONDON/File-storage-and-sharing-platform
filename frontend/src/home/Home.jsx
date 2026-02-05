import Header from "../header/Header.jsx";
import Videos from "../home/Videos.jsx"

export default function Home(){
    return(<>

        <Header sidebar = "icon1" homepage="YouTube" signin= "Sign In" signout="Sign-out" userAccount="My account">

        </Header>

        <Videos>

        </Videos>
        </>
    )

}