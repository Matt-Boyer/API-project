import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux"
import { thunkDeleteEvent } from "../../store/events"
// import {useParams} from 'react-router-dom'
import { useState } from "react"
import './deleteeventmodal.css'
import { useHistory } from "react-router-dom";

export default function DeleteEventModal ({eventId, groupId}) {
    const dispatch = useDispatch()
    const history = useHistory()

    const [errors, setErrors] = useState({})
    const {closeModal} = useModal()

    const deleteEvent = async() => {
        const err = await dispatch(thunkDeleteEvent(eventId))
        setErrors(err)
    }

    return (<div id="modaldeleteconfirmgroup">
    <h2 id="confirmdeletemodalgroup">Confirm Delete</h2>
    <h4>Are you sure you want to remove this event?</h4>
        <button className="buttonfordeletegroupmodal" id="buttonconfirmdeltetegroup"
        onClick={(e) => {
            deleteEvent()
            history.push(`/groupdetails/${groupId}`)
            closeModal()
        }}
        >Yes (Delete Event)</button>
        <button className="buttonfordeletegroupmodal" id="buttonfornoonmodalgroupdelete" onClick={closeModal}>No (Keep Event)</button>
    </div>
    )
}
