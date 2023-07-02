import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { thunkGetAllEvents } from '../../store/events'

export default function AllEvents () {
    const [errors, setErrors] = useState()
    const dispatch = useDispatch()
    useEffect(() => {
        const err = async () => {
            const err = await dispatch(thunkGetAllEvents())
            setErrors(err)
        }
        err()
    },[])
    const events = useSelector(state => state)
    console.log('thgis events',events)
    return(
        <div>
            <h2>all events</h2>
        </div>
    )
}
