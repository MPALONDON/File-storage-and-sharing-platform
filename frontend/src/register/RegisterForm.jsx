import {useEffect, useState,useRef} from "react";
import img from "../assets/sign_in_background.jpg";
import {useNavigate} from "react-router-dom";

export default function RegisterForm(){

    const [values,setValues] = useState({username:"",email: "",password: "",first_name: "",surname:""})
    const [touched, setTouched] = useState({username:false,email: false,password: false})
    const [isLoading,setIsLoading] = useState(false)
    const [emailExists, setEmail] = useState(null)
    const [userExists, setUser] = useState(null)

    const navigate = useNavigate();

    const containsUpperCase = (str) => str !== str.toLowerCase();

    const errors = {
      username: values.username.length >= 8 ? "" : "Username must be 8+ chars",
      email: /\S+@\S+\.\S+/.test(values.email) ? "" : "Enter a valid email",
      password: values.password.length >= 10 && containsUpperCase(values.password)? "" : "Password must be 10+ chars and contains at least 1 uppercase letter",
    }

    const hasErrors = Object.values(errors).some(error => error !== "");
    const hasMissingData = values.first_name === "" || values.surname === "";

    console.log(errors.username)
    function handleValue(e){

        const { name, value } = e.target;
        if(name==="email"){
            setEmail(null)
        }else{
            setUser(null)
        }

        setValues(prevState=>({
        ...prevState,
            [name]: value
        }))

        setTouched(prevState=>({
            ...prevState,
            [name]: value !== ""

            })
        );
    }

    async function checkUserExists(){

            const response = await fetch(
        "http://127.0.0.1:8000/check-user",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
          }, body: JSON.stringify({username: values.username,
                                        email:values.email}),
        });
            const data = await response.json()

          if (!response.ok) {
            return {
              username: data.detail.username === true,
              email: data.detail.email === true
            };
          }

          return { username: false, email: false };
        }

    //    useEffect(() => {
    //        if (!values.username && !values.email) return;
    //     const timeout = setTimeout(() => {
    //     checkUserExists();
    //   }, 600);
    //
    //   return () => clearTimeout(timeout);
    // }, [values.username, values.email]);

    async function createAccount(event){
        event.preventDefault();
        console.log(event.target)

        setIsLoading(true)
        const result = await checkUserExists()
        console.log(result)
        setUser(result.username);
        setEmail(result.email);
        setIsLoading(false)

        if (result.username || result.email) {
            setIsLoading(false);
            navigate("/register");
            return;
      }

        const response = await fetch("http://127.0.0.1:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
            await response.json();
            setIsLoading(false)
            navigate("/sign-in");

  }

    return(
        <main className="auth_flex">

            <div className="auth_Container">
                <h1> Register</h1>

                <form onSubmit={(event)=>createAccount(event)} className="auth_Form">
                    <label> Enter your first name:
                        <input value={values.first_name} name="first_name" type="text" id="first_name"
                               onChange={(e)=>{handleValue(e)}}/>
                    </label>
                    <label> Enter your surname:
                        <input value={values.surname} name="surname" type="text" id="surname"
                               onChange={(e)=>{handleValue(e)}}/>
                    </label>

                    {userExists && values.username!=="" ?
                        <label className="user_error">Username is taken
                            <input value={values.username} name="username" className={userExists || (touched.username && errors.username) ? "error" : ""} type="text" id="username"
                                   onChange={(e)=>{handleValue(e)}}/>
                        </label>
                        :
                        <label> Enter your username:
                        <input value={values.username} name="username" className={touched.username && errors.username ? "error" : ""} type="text" id="username"
                               onChange={(e)=>{handleValue(e)}}/>
                    </label>}

                    {emailExists && values.email!=="" ? <label className="user_error"> Email is taken:
                            <input value={values.email} name="email" type="text"  className={emailExists || (touched.email && errors.email)? "error" : ""} id="email"
                                   onChange={(e)=>{handleValue(e)}}/>
                        </label>
                        :
                        <label> Enter your email:
                        <input value={values.email} name="email" type="text"  className={touched.email && errors.email ? "error" : ""} id="email"
                               onChange={(e)=>{handleValue(e)}}/>
                        </label>}

                    <label> Enter a password:
                        <input value={values.password} name="password" className={touched.password && errors.password ? "error" : ""} type="password" id="password"
                               onChange={(e)=>{handleValue(e)}}/>
                    </label>
                    <button disabled={hasErrors || hasMissingData} type="submit">
                        {isLoading ? "Loading..." : "Sign-Up"}
                    </button>
                    <ul className="confirmation_errors">
                      {touched.username && errors.username && <li>{errors.username}</li>}
                      {touched.email && errors.email && <li>{errors.email}</li>}
                      {touched.password && errors.password && <li>{errors.password}</li>}
                    </ul>
                </form>
            </div>

                <div className="auth__background">
                <img src={img} alt="image of mountains"></img>
                </div>
        </main>

    )
}