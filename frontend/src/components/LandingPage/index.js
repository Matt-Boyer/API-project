import { NavLink } from "react-router-dom"

export default function LandingPage () {
    return (
        <div>
            <h2>LandingPage</h2>
            <NavLink exact to='/creategroup'>  --Create Group -- </NavLink>
            <NavLink exact to='/groupdetails/:groupId'>  --Group Details--  </NavLink>
            <NavLink exact to='/events/:groupId'>  --Events of a Group -- </NavLink>
            <NavLink exact to='/groups'> -- All Groups -- </NavLink>
            <NavLink exact to='/events'> -- All Events -- </NavLink>
            <NavLink exact to='/eventdetails/:eventId'> -- Event Details -- </NavLink>
            <NavLink exact to='/groups/:groupId/newevent'> -- Event Form -- </NavLink>
            <NavLink exact to='/groups/edit/:groupId'> -- Group Edit Form -- </NavLink>
            <NavLink exact to='/delete/event/:eventId'> -- Event Delete -- </NavLink>
            <NavLink exact to='/delete/group/:groupId'> -- Group Delete -- </NavLink>
        </div>
    )
}
