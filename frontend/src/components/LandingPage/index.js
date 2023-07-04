import { NavLink } from "react-router-dom"
import './LandingPage.css'
import { useHistory } from "react-router-dom"
import { useState } from "react"
import {useSelector} from 'react-redux'

import SignupFormModal from "../SignupFormModal"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"

export default function LandingPage () {
    const [hoverlink, setHoverlink] = useState('')
    const [hoverlink1, setHoverlink1] = useState('')
    const [hoverlink2, setHoverlink2] = useState('')
    const history = useHistory()
    const user = useSelector(state => state.session.user)

    return (
        <div id="main">
            <div id="maintopdiv">
                <div className="titleandpic">
                    <h1>The Simple Platform- Where Interests Make Aquaintences</h1>
                    <p>Do you want to meet completely stranger like you parents told you not to do? Well then this is the place to do it! At "Simple React App" we strive to connect people's hobbies to other random internet users. Our lawyer told us to tell you to use this at your own risk but we think there is a good chance you'll be ok. Maybe not, but hopefully.</p>
                </div>
                <div className="titleandpic">
                    <img id="maintopimage" src="https://ichef.bbci.co.uk/news/976/cpsprodpb/C70E/production/_102885905_82fe951a-0f71-469f-a76c-086ca2c37696.jpg" alt="people holding phones infront of their faces" />
                </div>
            </div>
            <div id="middlediv">
                <div id="middledivtext">
                    <h2 className="textmiddle">How Simple React App Works</h2>
                    <p className="ptagemiddletext">Make an account, join/create a group, go to an event for the group and make a new friend there.</p>
                </div>
            </div>
            <div id="bottomdiv">
                <div className="bottomlinkspic"
                    onClick={(e) => {
                        history.push('/groups')
                    }}
                    onMouseEnter={(e) => {
                        setHoverlink('hoverlink')
                    }}
                    onMouseLeave={(e) => {
                        setHoverlink('')
                    }}
                >
                    <img className={`imagesbotdivlink ${hoverlink}`} src="https://www.mymembersoftware.com/images/groups.jpg" alt="different colors of people in groups" />
                    <h3 className={`textmiddle ${hoverlink}`}>See All Groups</h3>
                    <p className={`ptagemiddletext ${hoverlink}`}>Click here to see a list of all the current groups to join</p>
                </div>
                <div className="bottomlinkspic"
                    onClick={(e) => {
                        history.push('/events')
                    }}
                    onMouseEnter={(e) => {
                        setHoverlink1('hoverlink1')
                    }}
                    onMouseLeave={(e) => {
                        setHoverlink1('')
                    }}
                >
                    <img className={`imagesbotdivlink ${hoverlink1}`} src="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/irving-redesign/Events_Page_Header_2903ed9c-40c1-4f6c-9a69-70bb8415295b.jpg" alt="people at a concert" />
                    <h3 className={`textmiddle ${hoverlink1} `}>Find An Event</h3>
                    <p className={`ptagemiddletext ${hoverlink1}`}>Click here to see a list of all the events you can attend</p>
                </div>
                <div className="bottomlinkspic"
                    onClick={(e) => {
                        if (user) {
                            history.push('/creategroup')
                        }
                    }}
                    onMouseEnter={(e) => {
                        setHoverlink2('hoverlink2')
                    }}
                    onMouseLeave={(e) => {
                        setHoverlink2('')
                    }}
                >
                    <img className={!user?"imagesbotdivlink":`imagesbotdivlink ${hoverlink2}`} src="https://cdn.churchleaders.com/wp-content/uploads/files/article_images/cell_groups_810848078.jpg" alt="person talking to start a new group" />
                    <h3 className={!user? "textmiddle" :`textmiddle ${hoverlink2}`}>Start A New Group</h3>
                    <p className={!user?"ptagemiddletext" :`ptagemiddletext ${hoverlink2}`}>{!user?"If logged in, click here to start a new group":"Click here to start new group"}</p>
                </div>
            </div>
            <div>
                <div>
                    <OpenModalMenuItem
                    itemText={<button id="joinbutton">Join Simple React App</button>}
                    modalComponent={<SignupFormModal />}
                    ></OpenModalMenuItem>
                </div>
            </div>
            {/* <h2>LandingPage</h2>
            <NavLink exact to='/creategroup'>  --Create Group -- </NavLink>
            <NavLink exact to='/groupdetails/:groupId'>  --Group Details--  </NavLink>
            <NavLink exact to='/events/:groupId'>  --Events of a Group -- </NavLink>
            <NavLink exact to='/groups'> -- All Groups -- </NavLink>
            <NavLink exact to='/events'> -- All Events -- </NavLink>
            <NavLink exact to='/eventdetails/:eventId'> -- Event Details -- </NavLink>
            <NavLink exact to='/groups/:groupId/newevent'> -- Event Form -- </NavLink>
            <NavLink exact to='/groups/edit/:groupId'> -- Group Edit Form -- </NavLink>
            <NavLink exact to='/delete/event/:eventId'> -- Event Delete -- </NavLink>
            <NavLink exact to='/delete/group/:groupId'> -- Group Delete -- </NavLink> */}
        </div>
    )
}
