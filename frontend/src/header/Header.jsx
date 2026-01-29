import { Link } from "react-router-dom";


export default function Header(){
    return(
       <nav className="main_container">
          <ul className="nav_list">
            <li className="nav_item">
              <a href="http://">icon1</a>
            </li>

            <li className="nav_item">
              <Link to="/">YouTube</Link>

            </li>

            <li className="nav_item nav_item--search">
              <div className="search_container">
                <input className="search_bar" name="SearchBar" placeholder="Search" />
                <button className="search_button" name="SearchButton">
                  Search
                </button>
              </div>
            </li>

              <li className="nav_item nav_item--signin">
                  {/*<div className="dropdown">*/}
                  {/*    <button className="dropbtn"></button>*/}
                  {/*    <div className="dropdown-content">*/}
                  {/*        <a href="#">View your channel</a>*/}
                  {/*        <a href="#">Link 2</a>*/}
                  {/*        <a href="#">Link 3</a>*/}
                  {/*    </div>*/}
                  {/*</div>*/}
                  <button>
                  <Link to="/sign-in">Sign-In</Link>
                      </button>
              </li>
          </ul>
       </nav>
    )
}