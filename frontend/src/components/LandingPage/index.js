import { NavLink } from "react-router-dom"

export default function LandingPage () {
    return (
        <div>
            <h2>LandingPage</h2>
            <NavLink exact to='/creategroup'>  Create Group  </NavLink>
            <NavLink exact to='/groupdetails/:groupId'>  Group Details  </NavLink>
            <NavLink exact to='/events/:groupId'>  Events of a Group  </NavLink>
            <NavLink exact to='/groups'>  All Groups  </NavLink>
        </div>
    )
}
