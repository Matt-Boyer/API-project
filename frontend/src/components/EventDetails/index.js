import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {useParams} from 'react-router-dom'
import { thunkEventDetails } from "../../store/events"

export default function EventDetails () {
    const [errors, setErrors] = useState({})
    const [testing, setTesting] = useState('')
    const dispatch = useDispatch()
    const {eventId} = useParams()
    useEffect(() => {
        const err = async () => {
            const err = await dispatch(thunkEventDetails(eventId))
            setErrors(err)
        }
        err()
    },[])
    useEffect(() => {
console.log("this is error",errors)
    },[testing])
    const event = useSelector(state => state)
    console.log('this is event',event)
    return (
        <div>
            <h2>event details</h2>
            <label>testing</label>
            <input type="text" value={testing} onChange={(e) => {setTesting(e.target.value)}}></input>
        </div>
    )
}
