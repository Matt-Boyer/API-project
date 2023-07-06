import { useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkCreateGroup, thunkEditGroup } from "../../store/groups"
import { thunkGetDetailsGroup } from "../../store/groups"
import {useParams} from 'react-router-dom'
import GroupForm from '../GroupForm'
import './groupeditform.css'
import { useHistory } from "react-router-dom"


export default function GroupEditForm () {
    const group = useSelector(state => state.groups.singleGroup)
    const [name, setName] = useState(group.name)
    const [about, setAbout] = useState(group.about)
    const [type, setType] = useState(group.type)
    const [privates, setPrivates] = useState(group.private.toString())
    console.log('privates' , privates)
    const [city, setCity] = useState(group.city)
    const [state, setState] = useState(group.state)
    const [imageUrl, setImageUrl] = useState(undefined)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const history = useHistory()
    const {groupId} = useParams()

    // const data = {name,about,type,private:privates,city,state}

    useEffect(() => {
        const err = async () => {
            const err = await dispatch(thunkGetDetailsGroup(groupId))
            // setErrors(err)
        }
        err()
    },[groupId])

    const onSubmit = async() => {
        await setErrors({})
        console.log('should be emtpy',errors)
        let payload = {name,about,type,private:privates,city,state}
        console.log("this is payload",  payload)
        const err = await dispatch(thunkEditGroup(groupId,payload))
        if (err.errors) {
            await setErrors(err.errors)
        }
        if (err.id) {
            history.push(`/groupdetails/${err.id}`)
        }
        console.log('this is error', errors)
    }

    return (
        <div>
             <div id="entiredivforcreategroupform">
            <div>
                <h4>Start New Group</h4>
                <h2>We'll walk you through a few steps to build your local community</h2>
            </div>
            <hr />
            <div>
                <h2>First, set your group's location.</h2>
                <h4>Meetup groups meet locally, in person and online. We'll connect you with people</h4>
                <h4>in your area, and more can join you online.</h4>
                <input type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value)
                    }}
                ></input>
                <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.city : ''}</div>
                <input type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => {
                        setState(e.target.value)
                    }}
                ></input>
                <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.state : ''}</div>
            </div>
            <hr />
            <div>
                <h2>What will your group's name be?</h2>
                <h4>Choose a name that will give people a clear idea of what the group is about. </h4>
                <h4>Feel free to get creative! You can edit this later if you change your mind.</h4>
                <input type="text"
                    id="widthforgroupnamecreatgroup"
                    placeholder="What is your group name?"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                ></input>
                 <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.name : ''}</div>
                <hr />
                <h2>Now describe what your group will be about</h2>
                <h4>People will see this when we promote your group, but you'll be able to add to it later, too.</h4>
                <h4>1. What's the purpose of the group?</h4>
                <h4>2. Who should join?</h4>
                <h4>3. What will you do at your events?</h4>

                <textarea
                    rows="12" cols="50"
                    id="textareacreategroup"
                    placeholder="Please write at least 30 characters"
                    value={about}
                    onChange={(e) => {
                        setAbout(e.target.value)
                    }}
                ></textarea>
                <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.about: ''}</div>
                <hr />
                <h2>Final steps...</h2>
                <h4>Is this an in person or online group?</h4>

                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value)
                    }}
                >
                    <option value=''>Select One</option>
                    <option value='In-person'>
                        In-person
                    </option>
                    <option value='Online'>
                        Online
                    </option>
                </select>
                <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.type : ''}</div>
                <h4>Is this group private or public?</h4>
                <select
                    value={privates}
                    onChange={(e) => {
                        setPrivates(e.target.value)
                    }}
                >
                    <option value=''>Select One</option>
                    <option value={true}>
                        Private
                    </option>
                    <option value={false}>
                        Public
                    </option>
                </select>
                <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.private : ''}</div>
                <h4>Please add an image url for your group below:</h4>
                <input type="text"
                    placeholder="Image Url"
                    value={imageUrl}
                    onChange={(e) => {
                        setImageUrl(e.target.value)
                    }}
                ></input>
                <hr />
                <button
                id="creategroupbuttoncreatgroup"
                    onClick={(e) => {
                        onSubmit()
                    }}
                >Update group</button>
            </div>
        </div>
            {/* <GroupForm data={data}></GroupForm> */}
            {/* <h2>group edit form</h2>
            <div>
            <label>name: </label>
            <input type="text"
            value={name}
            onChange={(e) => {
                setName(e.target.value)
            }}
            ></input>
            <label>about: </label>
            <input type="text"
            value={about}
            onChange={(e) => {
                setAbout(e.target.value)
            }}
            ></input>
            <label>type: </label>
            <select
            value={type}
            onChange={(e) => {
                setType(e.target.value)
            }}
            >
                <option value='In-person'>
                In-person
                </option>
                <option value='Online'>
                Online
                </option>
            </select>
            <label>private: </label>
            <input type="checkbox"
            value={privates}
            onChange={(e) => {
                setPrivates(!privates)
            }}
            ></input>
            <label>city: </label>
            <input type="text"
            value={city}
            onChange={(e) => {
                setCity(e.target.value)
            }}
            ></input>
            <label>state: </label>
            <input type="text"
            value={state}
            onChange={(e) => {
                setState(e.target.value)
            }}
            ></input>
            <button
            onClick={(e) => {
                onSubmit()
            }}
            >Submit</button>
        </div> */}
        </div>
    )
}
