import { useDispatch } from "react-redux"
import { thunkDeleteGroup } from "../../store/groups"
import {useParams} from 'react-router-dom'
import { useState } from "react"

export default function GroupDelete () {
    const dispatch = useDispatch()
    const {groupId} = useParams()
    const [errors, setErrors] = useState({})

    const deleteGroup = async() => {
        const err = await dispatch(thunkDeleteGroup(groupId))
        setErrors(err)
    }
    return (
        <div>
            <h2>group delete</h2>
            <button onClick={(e) => {
                deleteGroup()
            }}
            >Delete Group</button>
        </div>
    )
}
