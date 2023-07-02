import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkCreateEvent } from "../../store/events"
import {useParams} from 'react-router-dom'

export default function EventForm () {
    const [venueId, setVenueId] = useState(1)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('In-person')
    const [price, setPrice] = useState(0)
    const [capacity, setCapacity] = useState(1)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const {groupId} = useParams()

    const onSubmit = async() => {
        let payload = {venueId,name,description,type,capacity,price,startDate,endDate}
        const err = await dispatch(thunkCreateEvent(groupId,payload))
        if (err.errors) {
            setErrors(err.errors)
        }
        console.log('this is error', errors)
    }

    return (
        <div>
            <h2>event form</h2>
            <label>startdate: </label>
            <input type="text"
            value={startDate}
            onChange={(e) => {
                setStartDate(e.target.value)
            }}
            ></input>
            <label>endDate: </label>
            <input type="text"
            value={endDate}
            onChange={(e) => {
                setEndDate(e.target.value)
            }}
            ></input>
            <label>venue: </label>
            <input type="number"
            value={venueId}
            onChange={(e) => {
                setVenueId(e.target.value)
            }}
            ></input>
            <label>name: </label>
            <input type="text"
            value={name}
            onChange={(e) => {
                setName(e.target.value)
            }}
            ></input>
            <label>description: </label>
            <input type="text"
            value={description}
            onChange={(e) => {
                setDescription(e.target.value)
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
            <label>capacity: </label>
            <input type="number"
            value={capacity}
            onChange={(e) => {
                setCapacity(e.target.value)
            }}
            ></input>
            <label>price: </label>
            <input type="number"
            value={price}
            onChange={(e) => {
                setPrice(e.target.value)
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
