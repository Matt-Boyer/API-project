import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkCreateGroup } from "../../store/groups"

export default function GroupForm () {
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [type, setType] = useState('In-person')
    const [privates, setPrivates] = useState(false)
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()

    const onSubmit = async() => {
        let payload = {name,about,type,private:privates,city,state}
        const err = await dispatch(thunkCreateGroup(payload))
        if (err.errors) {
            setErrors(err.errors)
        }
        console.log('this is error', errors)
    }
    
    return (
        <div>
            <h2>group form</h2>
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
    )
}
