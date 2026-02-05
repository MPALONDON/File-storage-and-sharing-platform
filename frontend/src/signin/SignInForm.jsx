import {Link} from "react-router-dom";
import img from "../assets/sign_in_background.jpg"
import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function SignInForm(){
    const [isLoading,setIsLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentData,setData] = useState({})

    const navigate = useNavigate();



    async function login(e){
        e.preventDefault();
        console.log(e.target)

        const payload = {
            email,
            password
        }

        setIsLoading(true)

        const response = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok){
            setData(()=>({"message":"unsuccessful"}))
            throw new Error(`HTTP ERROR! Status: ${response.status}`)
        }
        const data = await response.json()
        localStorage.setItem("token", data.access_token);
        const token = localStorage.getItem("token");
        console.log(token)
        navigate("/");

        setIsLoading(false)
        console.log(data)
        setData(
            ()=>data)

    }

    return(
        <main className="auth_flex">
                <div className="auth_Container">
                    <h1 className="auth__text"> Sign-in</h1>
                        {currentData.message==="unsuccessful" ? <h3>Email or password is incorrect</h3> : null}

                    <form onSubmit={(event)=>login(event)} className="auth_Form">
                        <label>Email:
                            <input className="email_input" name="email" type="text" id="email" placeholder="Enter your email"
                                   onChange={(event)=>setEmail(event.target.value)}/>
                        </label>
                        <label>Password:
                            <input className="password_input" name="password" type="password" id="password" placeholder="Enter your password"
                                   onChange={(event)=>setPassword(event.target.value)}/>
                        </label>
                        <h4>Dont have an account?</h4>

                        <Link to="/register">Create an Account</Link>
                        <button type="submit">
                            Sign In
                        </button>
                    </form>
                </div>
                <div className="auth__background">
                    <img src={img} alt="image of mountains"></img>

                </div>
        </main>
    )
}