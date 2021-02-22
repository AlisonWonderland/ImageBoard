import { useState } from 'react'

// add settings link

const Navbar = () => {
    const [ isHomePage, setIsHomePage ] = useState(true)

    let page = ""
    isHomePage ? page = "Gallery"
    : page = "Home"

    const handlePageChange = () => {
        setIsHomePage(!isHomePage)
    }

    return (
        <div className="navbar">
            <ul className="nav">
                <li>
                    <a href="localhost:3000" id="home" className="nav-link">/KPG/ - KPOP Photoboard</a>
                </li>
                <li>
                    <a href="localhost:3000" className="nav-link" onClick={handlePageChange}>{page}</a>
                </li>
            </ul>
            <form>
                <input type="text" size="50" id="search"></input>
            </form>
        </div>
    )
}

export default Navbar;