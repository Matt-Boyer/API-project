import { useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkCreateGroup, thunkEditGroup } from "../../store/groups"
import { thunkGetDetailsGroup } from "../../store/groups"
import {useParams} from 'react-router-dom'


export default function GroupEditForm () {
    const group = useSelector(state => state.groups.singleGroup)
    console.log("this is group to edit",group)
    const [name, setName] = useState(group.name)
    const [about, setAbout] = useState(group.about)
    const [type, setType] = useState(group.type)
    const [privates, setPrivates] = useState(group.private)
    const [city, setCity] = useState(group.city)
    const [state, setState] = useState(group.state)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const {groupId} = useParams()

    useEffect(() => {
        const err = async () => {
            const err = await dispatch(thunkGetDetailsGroup(groupId))
            setErrors(err)
        }
        err()
    },[groupId])

    const onSubmit = async() => {
        let payload = {name,about,type,private:privates,city,state}
        const err = await dispatch(thunkEditGroup(payload))
        if (err.errors) {
            setErrors(err.errors)
        }
        console.log('this is error', errors)
    }

    return (
        <div>
            <h2>group edit form</h2>
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
        </div>
        </div>
    )
}
