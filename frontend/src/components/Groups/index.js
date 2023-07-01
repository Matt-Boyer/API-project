import { thunkGetAllGroups } from "../../store/groups"
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'


export default function Groups () {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkGetAllGroups())
    },[dispatch])

    const groups = useSelector(state => state.groups)
    console.log("this is groups",groups)
    if (!Object.values(groups).length)  {return null}



    return (
        <div>
            <h2>get all groups</h2>
        </div>


    )
}
