import { thunkGetAllGroups } from "../../store/groups"
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom"
import './groups.css'
import { NavLink } from "react-router-dom"


export default function Groups() {
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        dispatch(thunkGetAllGroups())
    }, [dispatch])

    const groupsAll = useSelector(state => Object.values(state.groups.allGroups))
    // if (!Object.values(groups).length)  {return null}

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
                    <h3 className="toptitleh3">Groups In Simple React App</h3>
                </div>
                {groupsAll.map((ele) => {
                    return <div key={ele.id} className="linedivingroup">
                        <hr></hr>
                        <div onClick={(e) => {
                            { history.push(`/groupdetails/${ele.id}`) }
                        }} className="groupdiv" key={ele.id}>
                            <div>
                                <img className='imagegroup' src={ele.previewImage ? `${ele.previewImage}` : "https://t3.ftcdn.net/jpg/00/36/94/26/360_F_36942622_9SUXpSuE5JlfxLFKB1jHu5Z07eVIWQ2W.jpg"} alt="preview of group" />
                            </div>

                            <div className="textgroup">
                                <h2 className="groupnametext">{ele.name}</h2>
                                <h4 className="groupcitytext">{ele.city}, {ele.state}</h4>
                                <p>{ele.about}</p>
                                <p className="groupprivatetext">{ele.numMembers} members &#183; {ele.private ? "Private" : "Public"}</p>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}
