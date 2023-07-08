import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetAllEvents } from '../../store/events'
import { useHistory } from "react-router-dom"
import { NavLink } from "react-router-dom"
import './AllEvents.css'

export default function AllEvents() {
    const [errors, setErrors] = useState()
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(() => {
        const err = async () => {
            const err = await dispatch(thunkGetAllEvents())
            setErrors(err)
        }
        err()
    }, [])
    let events = useSelector(state => Object.values(state.events.allEvents))
    let currentDate = new Date();
    let eventsCopy = events.slice()
    // events.push({ startDate: currentDate })
    // console.log('addedcurrentdate', events)
    events = events.filter((ele) => {
        return new Date(ele.startDate) > currentDate
    })
    eventsCopy = eventsCopy.filter((ele) => {
        return new Date(ele.startDate) < currentDate
    })
    events = events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    eventsCopy = eventsCopy.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

    return (
        <div>
            <div id="maindiv">
                <div className="toptitle">
                    <div id='randomtagfornavlinkevents'>
                        <NavLink id="toptitleevents" exact to='/events'>Events</NavLink>
                    </div>
                    <div id='randomtagfornavlinkgroups'>
                        <NavLink id="toptitlegroups" exact to='/groups'>Groups</NavLink>
                    </div>

                </div>
                <div className="toptitle">
                    <h3 className="toptitleh3">Events In Simple React App</h3>
                </div>
                <div>
                    {events.map((ele) => {
                        let str = ele.startDate
                        let split = str.split('T')
                        return <div key={ele.id} className="linedivingroup">
                            <hr></hr>
                            <div onClick={(e) => {
                                { history.push(`/eventdetails/${ele.id}/${ele.Group.id}`) }
                            }} className="groupdiv" key={ele.id}>
                                <div>
                                    <img className='imagegroup' src={ele.previewImage ? `${ele.previewImage}` : "https://t3.ftcdn.net/jpg/00/36/94/26/360_F_36942622_9SUXpSuE5JlfxLFKB1jHu5Z07eVIWQ2W.jpg"} alt="preview of group" />
                                </div>
                                <div className="textgroup">
                                    <h3 className="timeforgroupsdetailsevent">{split[0]} &#183; {split[1]}</h3>
                                    <h2>{ele.name}</h2>
                                    <h4 className="groupcitytext">{ele.Venue ? `${ele.Venue.city}, ${ele.Venue.state}` : "Venue: TBD"}</h4>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                <div className='linedivingroup'>
                    <hr />
                    <hr />
                    <h2 id='pasteventseventspageall'>Past Events</h2>
                    <div>
                    {eventsCopy.map((ele) => {
                        let str = ele.startDate
                        let split = str.split('T')
                        return <div key={ele.id} className="linedivingroup">
                            <hr></hr>
                            <div onClick={(e) => {
                                { history.push(`/eventdetails/${ele.id}/${ele.Group.id}`) }
                            }} className="groupdiv" key={ele.id}>
                                <div>
                                    <img className='imagegroup' src={ele.previewImage ? `${ele.previewImage}` : "https://t3.ftcdn.net/jpg/00/36/94/26/360_F_36942622_9SUXpSuE5JlfxLFKB1jHu5Z07eVIWQ2W.jpg"} alt="preview of group" />
                                </div>
                                <div className="textgroup">
                                    <h3 className="timeforgroupsdetailsevent">{split[0]} &#183; {split[1]}</h3>
                                    <h2>{ele.name}</h2>
                                    <h4 className="groupcitytext">{ele.Venue ? `${ele.Venue.city}, ${ele.Venue.state}` : "Venue: TBD"}</h4>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                </div>
            </div>
        </div>
    )
}
