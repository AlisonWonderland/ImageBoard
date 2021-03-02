import {
    Link
} from "react-router-dom";
  
const NavLinks = ({ type }) => {
    const jumpPosition = type === 'bot' ? 'Top' : 'Bottom'
    return (
        <span id={type === 'bot' ? "Bottom": ""}>
            [<Link to="/">Return</Link>]
            [<Link to="/Catalog">Catalog</Link>]
            [<a href={`#${jumpPosition}`}>{jumpPosition}</a>]
        </span>
    )
}

export default NavLinks