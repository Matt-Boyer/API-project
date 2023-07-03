import { thunkGetAllGroups } from "../../store/groups"
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import './groups.css'

export default function Groups () {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkGetAllGroups())
    },[dispatch])

    const groups = useSelector(state => Object.values(state.groups.allGroups))
    // if (!Object.values(groups).length)  {return null}
    console.log(groups)
    return (
        <div>
            <div id="maindiv">
                <div className="toptitle">
                    <h2>Events</h2>
                    <h2>Groups</h2>
                </div>
                <div className="toptitle">
                    <h3>Groups In Simple React App</h3>
                </div>
                {groups.map((ele) => {
                     return <div className="groupdiv" key={ele.id}>
                                <div>
                                    <img className='imagegroup' src={`${ele.previewImage}`} alt="preview of group" />
                                </div>
                                <div className="textgroup">
                                <h2>{ele.name}</h2>
                                <h4>{ele.city}, {ele.state}</h4>
                                </div>
                            </div>
                })}
            </div>
        </div>
    )
}
