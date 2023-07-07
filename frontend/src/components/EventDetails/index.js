import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from 'react-router-dom'
import { thunkEventDetails } from "../../store/events"
import { NavLink } from "react-router-dom"
import { thunkGetDetailsGroup } from "../../store/groups"
import OpenDeleteButton from "../DeleteGroupModal/OpenDeleteModal"
import DeleteEventModal from "../DeleteEventModal"
import './eventdetails.css'

export default function EventDetails() {
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const { eventId } = useParams()
    const { groupId } = useParams()
    const event = useSelector(state => state.events.singleEvent)
    const group = useSelector(state => state.groups.singleGroup)
    const user = useSelector(state => state.session.user)
    useEffect(() => {
        const err = async () => {
            const err = await dispatch(thunkEventDetails(eventId))
            setErrors(err)
        }
        err()
        const err1 = async () => {
            const err = await dispatch(thunkGetDetailsGroup(groupId))
            setErrors(err)
        }
        err1()
    }, [])
    // useEffect(() => {
        //     console.log("this is error", errors)
        // }, [testing])
        // console.log('this is event', event)

        if (!Object.values(event).length || !Object.values(group).length || group === undefined) { return null }
        let str = event.startDate
        let split = str.split('T')
        let str1 = event.endDate
        let split1 = str1.split('T')
        console.log('ert', group)
        return (
            <>
            <div id="divholdingeverythingeventsdetailspage">
                <div id="navlinkandeventnameeventdetails">
                    <NavLink id='navlinkforeventsfromdetails' exact to='/events'>{'<'}{'< Events'}</NavLink>
                    <h2>{event.name}</h2>
                    <h4>Group Organizer : {group.Organizer.firstName} {group.Organizer.lastName}</h4>
                </div>
                <div id="groupprevieweventsdetails">
                    <div>
                        <img id="mainpiceventdetails" src={event.EventImages.length > 0 ? `${event.EventImages[0].url}` : "https://t3.ftcdn.net/jpg/00/36/94/26/360_F_36942622_9SUXpSuE5JlfxLFKB1jHu5Z07eVIWQ2W.jpg"} alt="no image available" />
                    </div>
                    <div id="groupprevieweventsdetails">
                        <div id="groupdetailstoprightdivpreview">
                            <div id="tooomanydivs">
                                <div>
                                    <img id='imagegroupeventdetails' src={(Object.values(group).length ? (group.GroupImages[0]) : false) ? (group.GroupImages[0].url===null?"https://t3.ftcdn.net/jpg/00/36/94/26/360_F_36942622_9SUXpSuE5JlfxLFKB1jHu5Z07eVIWQ2W.jpg":`${group.GroupImages[0].url}`) : "https://t3.ftcdn.net/jpg/00/36/94/26/360_F_36942622_9SUXpSuE5JlfxLFKB1jHu5Z07eVIWQ2W.jpg"} alt="preview of group" />
                                </div>
                                <div id="imsotiredofcomingupwithnames">
                                    <h5 id="groupnamegrouppreviewimage">{group.name}</h5>
                                    <p id="privategroupdprevieweventsdetails">{group.private ? 'Private' : "Public"}</p>
                                </div>
                            </div>
                            <div id="eventdetailsstarttimeendtimemaindiv">
                                <div id="eventdetailsstarttimeendtime">
                                    <div id="divholdingclock">
                                        <i className="fa-sharp fa-regular fa-clock"></i>
                                    </div>
                                    <div id="divholdingtimeandclock">
                                        <h3 className="timeforeventdetials">START {split[0]} &#183; {split[1]}</h3>
                                        <h3 className="timeforeventdetials">END {split1[0]} &#183; {split1[1]}</h3>
                                    </div>
                                </div>
                                <div id="divholdingpriceeventdetails">
                                    <div>
                                        <i className="fa-regular fa-dollar-sign"></i>
                                    </div>
                                    <div id="didntknowicanincreasefontsizehere">
                                        {event ? (parseInt(event.price) === 0 ? 'Free' : parseInt(event.price).toFixed(2)) : 'Free'}
                                    </div>
                                </div>
                                <div id="divholdingmappinandlocation">
                                    <div>
                                        <i className="fa-solid fa-map-pin"></i>
                                    </div>
                                    <div id="eventtpyeeventdetails">
                                        {event.type}
                                    </div>
                                    <div id="divholdingdeleteforeventdetails">
                                    {(user? user.id:Infinity) !== group.Organizer.id ? '' :
                                    <OpenDeleteButton
                                        buttonText='Delete'
                                        modalComponent={<DeleteEventModal eventId={eventId} groupId={groupId} />}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="descriptiondiveventdetails">
                    <h2>Description</h2>
                    <p>{event.description}</p>
                </div>
            </div>
        </>
    )
}
