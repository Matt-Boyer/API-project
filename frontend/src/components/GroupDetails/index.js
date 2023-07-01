import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {useParams} from 'react-router-dom'
import { thunkGetDetailsGroup } from "../../store/groups"

export default function GroupDetails () {
    const [errors, setErrors] = useState({})
    const [testing, setTesting] = useState('')
    const dispatch = useDispatch()
    const {groupId} = useParams()
    useEffect(() => {
        const err = async () => {
            const err = await dispatch(thunkGetDetailsGroup(groupId))
            setErrors(err)
        }
        err()
    },[])
    useEffect(() => {
console.log("this is error",errors)
    },[testing])
    const group = useSelector(state => state)
    console.log('this is group',group)
    return (
        <div>
            <h2>group details</h2>
            <label>testing</label>
            <input type="text" value={testing} onChange={(e) => {setTesting(e.target.value)}}></input>
        </div>
    )
}
