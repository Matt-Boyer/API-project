import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkAddImageEvent, thunkCreateEvent } from "../../store/events"
import { useParams } from 'react-router-dom'
import { thunkGetDetailsGroup } from "../../store/groups"
import { useHistory } from "react-router-dom"
import './eventform.css'

export default function EventForm() {
    // const [venueId, setVenueId] = useState(1)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')
    const [price, setPrice] = useState('')
    const [capacity, setCapacity] = useState(1)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const history = useHistory()
    const { groupId } = useParams()

    useEffect(() => {
        const err = async () => {
            const err = await dispatch(thunkGetDetailsGroup(groupId))
            // setErrors(err)
        }
        err()
    }, [])

    const group = useSelector(state => state.groups.singleGroup)

    const onSubmit = async () => {
        // setErrors({})
        let payload = { name, description, type, capacity, price, startDate, endDate }
        const err = await dispatch(thunkCreateEvent(groupId, payload))
        // console.log('this is error', err.errors)
        if (err.errors) {
            setErrors(err.errors)
        }
        // const {imageEvent} = imageURL
        // console.log('this is return from create event', err)
        // console.log('imgaeEvent444444444444444', imageURL, err.id)
        const err1 = await dispatch(thunkAddImageEvent({'url':imageURL, 'preview':true},err.id))
        if (err.id) {
            history.push(`/eventdetails/${err.id}/${groupId}`)
        }
    }

    if (!Object.values(group).length || !group) return null

    return (
        <div id="divholdingeverythingcreateevent">
            <div>

                <h2>Create an event for {group.name}</h2>
                <h4 className="allh4tagsaboveinputscreateevent">What is the name of your event?</h4>
                <input type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                ></input>
                <div className="errormessagescreateevent">{Object.values(errors).length > 0 ? errors.name : ''}</div>
            </div>

            <hr className="hreventforms" />

            <h4 className="allh4tagsaboveinputscreateevent">Is this an in person or online event?</h4>
            <select
                value={type}
                onChange={(e) => {
                    setType(e.target.value)
                }}
            >
                <option value=''>*Select One</option>
                <option value='In-person'>
                    In-person
                </option>
                <option value='Online'>
                    Online
                </option>
            </select>
            <div className="errormessagescreateevent">{Object.values(errors).length > 0 ? errors.type : ''}</div>
            <h4 className="allh4tagsaboveinputscreateevent" id="priceofeventneedsnegativeduetodollarsignposition">What is the price for your event?</h4>
            <div>
                <div id="dollarsignineventcreate">$</div>
                <input type="number"
                    className="priceforeventeventcreate"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => {
                        setPrice(e.target.value)
                    }}
                ></input>
                <div className="errormessagescreateevent">{Object.values(errors).length > 0 ? errors.price : ''}</div>
            </div>
            <hr className="hreventforms" />

                <h4 className="allh4tagsaboveinputscreateevent">When does your event start?</h4>
                <input type="datetime-local"
                    className="startendcreateventinput"
                    placeholder="MM/DD/YYYY, HH/mm AM"
                    value={startDate}
                    onChange={(e) => {
                        setStartDate(e.target.value)
                    }}
                ></input>
                <div className="errormessagescreateevent">{Object.values(errors).length > 0 ? errors.startDate : ''}</div>
                <h4 className="allh4tagsaboveinputscreateevent">When does your event end?</h4>
                <input type="datetime-local"
                    className="startendcreateventinput"
                    placeholder="MM/DD/YYYY, HH/mm PM"
                    value={endDate}
                    onChange={(e) => {
                        setEndDate(e.target.value)
                    }}
                ></input>
                <div className="errormessagescreateevent">{Object.values(errors).length > 0 ? errors.endDate : ''}</div>
                <hr className="hreventforms" />
                <h4 className="allh4tagsaboveinputscreateevent">Please add in image url for your event below:</h4>
                <input type="text"
                    placeholder="Image URL"
                    value={imageURL}
                    onChange={(e) => {
                        setImageURL(e.target.value)
                    }}
                ></input>

            <hr className="hreventforms" />
            <h4 className="allh4tagsaboveinputscreateevent">Please describe your event:</h4>
            <textarea
                rows="12" cols="50"
                id="textareacreateevent"
                placeholder="Please write at least 30 characters"
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value)
                }}
            ></textarea>
            <div className="errormessagescreateevent">{Object.values(errors).length > 0 ? errors.description : ''}</div>
            {/* <label>venue: </label>
            <input type="number"
            value={venueId}
            onChange={(e) => {
                setVenueId(e.target.value)
            }}
        ></input> */}
            <div >
                <button
                    id="bottomdivholdingbuttoncreateevent"
                    onClick={(e) => {
                        onSubmit()
                    }}
                >Create Event</button>
            </div>
        </div>
    )
}
