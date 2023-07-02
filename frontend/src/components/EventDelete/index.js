import { useDispatch } from "react-redux"
import { thunkDeleteEvent } from "../../store/events"
import {useParams} from 'react-router-dom'
import { useState } from "react"

export default function EventDelete () {
    const dispatch = useDispatch()
    const {eventId} = useParams()
    const [errors, setErrors] = useState({})
    console.log('this is eventid',eventId)

    const deleteEvent = async() => {
        const err = await dispatch(thunkDeleteEvent(eventId))
        setErrors(err)
    }
    return (
        <div>
            <h2>event delete</h2>
            <button onClick={(e) => {
                deleteEvent()
            }}
            >Delete Event</button>
        </div>
    )
}
