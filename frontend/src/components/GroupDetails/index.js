import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from 'react-router-dom'
import { thunkGetDetailsGroup } from "../../store/groups"
import { NavLink } from "react-router-dom"
import { thunkGetEventsGroup } from "../../store/events"
import { useHistory } from "react-router-dom"
import './groupdetail.css'
import OpenDeleteButton from "../DeleteGroupModal/OpenDeleteModal"
import DeleteGroupModal from "../DeleteGroupModal"

export default function GroupDetails() {
    const [errors, setErrors] = useState({})
    const [testing, setTesting] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()
    const { groupId } = useParams()
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        const err = async () => {
            const err = await dispatch(thunkGetDetailsGroup(groupId))
            setErrors(err)
        }
        err()
        const errEvents = async () => {
            const error = await dispatch(thunkGetEventsGroup(groupId))
            setErrors(error)
        }
        errEvents()
    }, [groupId])

    const event = useSelector(state => state.events.allEvents)
    const group = useSelector(state => state.groups.singleGroup)
    // if (!Object.values(event).length || !event) return null //commented out might break
    // console.log('thwhwhwthwht',event)
    if (!group || !Object.values(group).length || group.GroupImages === undefined) return null
    const imageArr = Object.values(group.GroupImages)
    const pic = imageArr.find((ele) => {
        return ele.preview === true
    })
    let eventArr = Object.values(event)
    let eventsCopy = eventArr.slice()
    let currentDate = new Date();
    eventArr = eventArr.filter((ele) => {
        return new Date(ele.startDate) > currentDate
    })
    eventsCopy = eventsCopy.filter((ele) => {
        return new Date(ele.startDate) < currentDate
    })
    eventArr =  eventArr.sort((a,b)=> new Date(a.startDate) - new Date(b.startDate))
    // console.log('testevent arr',eventArr)
    eventsCopy = eventsCopy.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

    return (
        // <div id='gapfromtopdetailsgroups'>
            <div id="maindivdetailssingle">
                <NavLink id='navlinkforgroupsfromdetails' exact to='/groups'>{'<'}{'< Groups'}</NavLink>
                <div id="mainpicdiv">
                    <div>
                        <img id="mainpic" src={(pic? pic.url:pic) ? `${pic.url}` : "https://t3.ftcdn.net/jpg/00/36/94/26/360_F_36942622_9SUXpSuE5JlfxLFKB1jHu5Z07eVIWQ2W.jpg"} alt="no image available" />
                    </div>
                    <div id="textindetailsgroup">
                        <h2 id="topgaph2details">{group.name}</h2>
                        <h4 className="fontweightdetails">{group.city}, {group.state}</h4>
                        <h4 className="fontweightdetails">{eventArr.length} events &#183; {group.private ? "Private" : "Public"}</h4>
                        <h4 className="fontweightdetails">Organized by {group.Organizer.firstName} {group.Organizer.lastName}</h4>
                        {(user? user.id : Infinity) !== group.Organizer.id ?
                        <button onClick={(e) => {alert("Feature Coming Soon")}} id={user? "joingroupdetails": 'hiddenUser'}>Join this group</button>
                        :<div id="greybuttondivdetailsgroup">
                        <button className="greybuttonsgroupdetails"
                        onClick={(e) => {
                            history.push(`/groups/${groupId}/newevent`)
                        }}
                        >Create Event</button>
                        <button className="greybuttonsgroupdetails"
                        onClick={(e) => {
                            history.push(`/groups/edit/${groupId}`)
                        }}
                        >Update</button>
                        {/* <button className="greybuttonsgroupdetails"
                        >Delete</button> */}
                        <OpenDeleteButton
                        buttonText='Delete'
                        modalComponent={<DeleteGroupModal groupId={groupId}/>}

                        />
                        </div>}
                    </div>
                </div>
                <div id="allupcomingeventsgroudetails">
                    <div>
                        <h2 id="organizertext">Organizer</h2>
                        <h4 id="organizername" className="fontweightdetails">{group.Organizer.firstName} {group.Organizer.lastName}</h4>
                    </div>
                    <div>
                        <h2 id="whatwereabout">What we're about</h2>
                        <p id="abouttextgroupdetails">{group.about}</p>
                    </div>
                    <div>
                        <h2>Upcoming Events: {eventArr.length}</h2>
                        <hr />
                        {eventArr.map((ele) => {
                            let str = ele.startDate
                            let split = str.split('T')
                            return  <div key={ele.id}>
                            <div >
                                <div className="eventspreviewgroupdetail"
                                onClick={(e) => {
                                    history.push(`/eventdetails/${ele.id}/${ele.Group.id}`)
                                }}
                                >
                                    <div>
                                        <img className="imageforgroupdetailsevent" src={ele.previewImage ? `${ele.previewImage}` : "https://t3.ftcdn.net/jpg/00/36/94/26/360_F_36942622_9SUXpSuE5JlfxLFKB1jHu5Z07eVIWQ2W.jpg"} alt="" />
                                    </div>
                                    <div className="infonexttopicgroudetails">
                                        <h3 className="timeforgroupsdetailsevent">{split[0]} &#183; {split[1]}</h3>
                                        <h2>{ele.name}</h2>
                                        <h4>{ele.Venue? `${ele.Venue.city}, ${ele.Venue.state}` : "Venue: TBD" }</h4>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            </div>
                        })}
                    </div>
                    <div>
                    <h2>Past Events: {eventsCopy.length}</h2>
                        <hr />
                        {eventsCopy.map((ele) => {
                            let str = ele.startDate
                            let split = str.split('T')
                            return  <div key={ele.id}>
                            <div >
                                <div className="eventspreviewgroupdetail"
                                onClick={(e) => {
                                    history.push(`/eventdetails/${ele.id}/${ele.Group.id}`)
                                }}
                                >
                                    <div>
                                        <img className="imageforgroupdetailsevent" src={ele.previewImage ? `${ele.previewImage}` : "https://t3.ftcdn.net/jpg/00/36/94/26/360_F_36942622_9SUXpSuE5JlfxLFKB1jHu5Z07eVIWQ2W.jpg"} alt="" />
                                    </div>
                                    <div className="infonexttopicgroudetails">
                                        <h3 className="timeforgroupsdetailsevent">{split[0]} &#183; {split[1]}</h3>
                                        <h2>{ele.name}</h2>
                                        <h4>{ele.Venue? `${ele.Venue.city}, ${ele.Venue.state}` : "Venue: TBD" }</h4>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            </div>
                        })}
                    </div>
                </div>
            </div>

        // {/* </div> */}
    )
}
