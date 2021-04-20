import { useState } from 'react'
import {
  Link
} from "react-router-dom";

// add settings link

const Navbar = () => {
    return (
            <div className="navbar" id="top">
                <ul className="nav">
                    <li>
                        <Link id="home" className="nav-link" to="/">Imageboard</Link>
                    </li>
                    <li>
                        <Link className="nav-link" to="/Catalog">Catalog</Link>
                    </li>
                </ul>
                {/* <form>
                    <input type="text" size="50" id="search"></input>
                </form> */}
            </div>
    )
}

export default Navbar;