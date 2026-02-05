import { Link ,useNavigate} from "react-router-dom";
import { useState } from "react";

export default function Header({ sidebar, homepage, signin, signout, userAccount }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const navigate = useNavigate();

  async function find_user(){
      console.log(token)

      const response = await fetch("http://127.0.0.1:8000/username", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }}

    )
      const data = await response.json()

      navigate(`/${data.username}`)

  }

  return (
    <nav className="main_container">
      <div className="nav_left">
        <a href="#">{sidebar}</a>
        <Link to="/">{homepage}</Link>
      </div>

      <div className="nav_center">
        <input className="search_bar" placeholder="Search" />
        <button className="search_button">Search</button>
      </div>

      <div className="nav_right">
        {token ? (
            <>
                <div className="dropdown">
                      <button className="dropbtn">
                        {userAccount} <i className="fa fa-caret-down"></i>
                      </button>

                      <div className="dropdown-content">
                        <button onClick={find_user}>
                            View your channel</button>
                        <button>Link 2</button>
                        <button>Link 3</button>
                      </div>
                </div>
                {/*<button onClick={find_user}>{userAccount}</button>*/}
                <button
                    onClick={() => {
                        localStorage.clear();
                        setToken(null);
                    }}
                >
                    {signout}
                </button>
            </>
        ) : (
            <Link to="/sign-in">{signin}</Link>
        )}
      </div>
    </nav>
  );
}
