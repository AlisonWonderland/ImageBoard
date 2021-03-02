import NavLinks from './NavLinks'
import CommentLink from './CommentLink'
import ThreadData from './ThreadData'
import Row from './Row'

const NavRow = ({ threadData, type }) => {
    return (
        <Row>
            <NavLinks type={type}></NavLinks>
            <CommentLink></CommentLink>
            <ThreadData threadData={threadData}></ThreadData>
        </Row>
    )
}

export default NavRow