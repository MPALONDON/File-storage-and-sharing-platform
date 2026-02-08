import { Link ,useNavigate} from "react-router-dom";
import { useState ,useEffect} from "react";

export default function Header({ sidebar, homepage, signin, signout, userAccount }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);

  const navigate = useNavigate();

  useEffect(()=>{
        const checkAuthentication = async ()=>{
        const response = await fetch(`http://localhost:8000/username`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
        credentials: "include",
        })
             if (response.ok){
                 const data = await response.json()
                 setIsAuthenticated(true)
                 setUsername(data.username);
             }
             else {
                 setIsAuthenticated(false)
             }

    };
    checkAuthentication()
    },[])


    function goToChannel(){
      if (username) {
          console.log(username)
          navigate(`/${username}`);
      }
    }

 const logoutUser = async ()=>{
      const response = await fetch("http://localhost:8000/logout",{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
            credentials: "include",
      })
     if(response.ok){
     const data = await response.json()
         setIsAuthenticated(false)
     }
     else{
         throw new Error(`HTTP ERROR! Status: ${response.status}`)
     }

 }


  return (
    <nav className="main_container">
      <div className="nav_left">
        <a href="#">{sidebar}</a>
        <Link to="/">{homepage}</Link>
      </div>

      <div className="nav_center">
          <form onSubmit={(event)=>{
              event.preventDefault();
                const formData = new FormData(event.target);
                const searchQuery = formData.get("search_query")?.trim() || "";

    navigate(`${searchQuery ? `?search_query=${searchQuery}` : ""}`);
          }}>
        <input name="search_query" className="search_bar" placeholder="Search" />
        <button className="search_button">Search</button>
              </form>
      </div>

      <div className="nav_right">
        {isAuthenticated ? (
            <>
                <div className="dropdown">
                      <button className="dropbtn">
                        {userAccount} <i className="fa fa-caret-down"></i>
                      </button>

                      <div className="dropdown-content">
                        <button onClick={goToChannel}>
                            View your channel</button>
                        <button>Link 2</button>
                        <button>Link 3</button>
                      </div>
                </div>
                {/*<button onClick={find_user}>{userAccount}</button>*/}
                <button onClick={logoutUser}
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
