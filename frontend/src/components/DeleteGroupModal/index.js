import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux"
import { thunkDeleteGroup } from "../../store/groups"
// import {useParams} from 'react-router-dom'
import { useState } from "react"

import { useHistory } from "react-router-dom";

export default function DeleteGroupModal ({groupId}) {
    const dispatch = useDispatch()
    const history = useHistory()

    const [errors, setErrors] = useState({})
    const {closeModal} = useModal()

    const deleteGroup = async() => {
        const err = await dispatch(thunkDeleteGroup(groupId))
        setErrors(err)
    }

    return (<div id="modaldeleteconfirmgroup">
    <h2 id="confirmdeletemodalgroup">Confirm Delete</h2>
    <h4>Are you sure you want to remove this group?</h4>
        <button className="buttonfordeletegroupmodal" id="buttonconfirmdeltetegroup"
        onClick={(e) => {
            deleteGroup()
            history.push('/groups')
            closeModal()
        }}
        >Yes (Delete Group)</button>
        <button className="buttonfordeletegroupmodal" id="buttonfornoonmodalgroupdelete" onClick={closeModal}>No (Keep Group)</button>
    </div>
    )
}
