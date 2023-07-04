import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {useParams} from 'react-router-dom'
import { thunkGetEventsGroup } from "../../store/events"


export default function EventsOfGroup () {
    const [errors, setErrors] = useState()
    const dispatch = useDispatch()
    const {groupId} = useParams()
    useEffect(() => {
        const errEvents = async() => {
            const error = await dispatch(thunkGetEventsGroup(groupId))
            setErrors(error)
        }
        errEvents()
    },[])
    const event = useSelector(state => state)
    console.log('this is event.groups.Events',errors)
    console.log('this is state', event )

    return (
        <div>
            <h1>EventsOfGroup</h1>

        </div>
    )
}
