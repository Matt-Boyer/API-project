import { useState,useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkAddImage, thunkCreateGroup, thunkDeleteImage, thunkEditGroup } from "../../store/groups"
import { thunkGetDetailsGroup } from "../../store/groups"
import {useParams} from 'react-router-dom'
import GroupForm from '../GroupForm'
import './groupeditform.css'
import { useHistory, Redirect } from "react-router-dom"


export default function GroupEditForm () {
    const group = useSelector(state => state.groups.singleGroup)
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [type, setType] = useState('')
    const [privates, setPrivates] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [imageUrl, setImageUrl] = useState(undefined)
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const history = useHistory()
    const {groupId} = useParams()
    const user = useSelector(state => state.session.user)

    const testRef = useRef();
    useEffect(() => {
        if (testRef.current !== undefined)  {
            if (errors.city)   {
                testRef.current.focus();
            }
            if (errors.state)   {
                testRef.current.focus();
            }
            if (errors.name)   {
                testRef.current.focus();
            }
        }
    }, [errors]);

    useEffect(() => {
            dispatch(thunkGetDetailsGroup(groupId))
            // setErrors(err)
    },[])

    useEffect(() => {
        if (group.name) { // Check if group data is available
            setCity(group.city ? group.city : ''); // Set initial values based on group data
            setState(group.state ? group.state : '');
            setName(group.name ? group.name : '');
            setAbout(group.about ? group.about : '');
            setType(group.type ? group.type : '');
            setPrivates(group.private ===undefined? '':group.private.toString())
        }
    }, [group]);
    // (group.private ===undefined? '':group.private.toString())
    // console.log('this is user',(group.Organizer ===undefined? -1:group.Organizer.id))
    // if (((user? user.id : Infinity) !== (group.Organizer ===undefined? -1:group.Organizer.id))) {
    //     return <Redirect to='/' />
    // }

    const updateFile = e => {
        const file = e.target.files[0];
        if (file) setImage(file);
      };

    //   if (Object.values(group).length === 0 || group === undefined || group === null) {
    //     return null
    // }

    const imageArr = group && group.GroupImages ? Object.values(group.GroupImages) : [];

    const pic = imageArr.find((ele) => {
        return ele.preview === true
    })
    let fileImg = pic?.url?.split('/').slice(4).join("/")

    const onSubmit = async() => {
        await setErrors({})
        let payload = {name,about,type,private:privates,city,state}
        const err = await dispatch(thunkEditGroup(groupId,payload))
        if (group.GroupImages.length > 0 && image !== null && group.GroupImages[0]?.url !== null) {
            await dispatch(thunkDeleteImage(group.GroupImages[0].id))
            const err1 = await dispatch(thunkAddImage( image , err.id, fileImg))
        }
        if (group.GroupImages[0]?.url === null && image !== null) {
             await dispatch(thunkDeleteImage(group.GroupImages[0].id))
            const err1 = await dispatch(thunkAddImage( image , err.id, fileImg='null'))
        }
        if (group.GroupImages.length === 0 && image !== null) {
            const err1 = await dispatch(thunkAddImage( image , err.id, fileImg='null'))
        }
        if (err.errors) {
            await setErrors(err.errors)

        }
        if (err.id) {
            history.push(`/groupdetails/${err.id}`)
        }
    }

    return (
        <div>
             <div id="entiredivforcreategroupform">
            <div>
                <h4>Start New Group</h4>
                <h2>We'll walk you through a few steps to build your local community</h2>
            </div>
            <hr />
            <div>
                <h2>First, set your group's location.</h2>
                <h4>Meetup groups meet locally, in person and online. We'll connect you with people</h4>
                <h4>in your area, and more can join you online.</h4>
                <input type="text"
                    ref={testRef}
                    placeholder="City"
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value)
                    }}
                    ></input>

                <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.city : ''}</div>
                <input type="text"
                    ref={testRef}
                    placeholder="State"
                    value={state}
                    onChange={(e) => {
                        setState(e.target.value)
                    }}
                ></input>
                <div id="testforfocuserror" className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.state : ''}</div>
            </div>
            <hr />
            <div>
                <h2>What will your group's name be?</h2>
                <h4>Choose a name that will give people a clear idea of what the group is about. </h4>
                <h4>Feel free to get creative! You can edit this later if you change your mind.</h4>
                <input type="text"
                    ref={testRef}
                    id="widthforgroupnamecreatgroup"
                    placeholder="What is your group name?"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                ></input>
                 <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.name : ''}</div>
                <hr />
                <h2>Now describe what your group will be about</h2>
                <h4>People will see this when we promote your group, but you'll be able to add to it later, too.</h4>
                <h4>1. What's the purpose of the group?</h4>
                <h4>2. Who should join?</h4>
                <h4>3. What will you do at your events?</h4>

                <textarea
                    rows="12" cols="50"
                    id="textareacreategroup"
                    placeholder="Please write at least 30 characters"
                    value={about}
                    onChange={(e) => {
                        setAbout(e.target.value)
                    }}
                ></textarea>
                <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.about: ''}</div>
                <hr />
                <h2>Final steps...</h2>
                <h4>Is this an in person or online group?</h4>

                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value)
                    }}
                >
                    <option value=''>Select One</option>
                    <option value='In-person'>
                        In-person
                    </option>
                    <option value='Online'>
                        Online
                    </option>
                </select>
                <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.type : ''}</div>
                <h4>Is this group private or public?</h4>
                <select
                    value={privates}
                    onChange={(e) => {
                        setPrivates(e.target.value)
                    }}
                >
                    <option value=''>Select One</option>
                    <option value={true}>
                        Private
                    </option>
                    <option value={false}>
                        Public
                    </option>
                </select>
                <div className="errormessagescreategroup">{Object.values(errors).length > 0 ? errors.private : ''}</div>
                <h4>Please add an image url for your group below:</h4>
                <input type="file"
                    placeholder="Image Url"
                    // value={imageUrl}
                    onChange={updateFile}
                ></input>
                <hr />
                <button
                id="creategroupbuttoncreatgroup"
                    onClick={(e) => {
                        onSubmit()
                    }}
                >Update group</button>
            </div>
        </div>
            {/* <GroupForm data={data}></GroupForm> */}
            {/* <h2>group edit form</h2>
            <div>
            <label>name: </label>
            <input type="text"
            value={name}
            onChange={(e) => {
                setName(e.target.value)
            }}
            ></input>
            <label>about: </label>
            <input type="text"
            value={about}
            onChange={(e) => {
                setAbout(e.target.value)
            }}
            ></input>
            <label>type: </label>
            <select
            value={type}
            onChange={(e) => {
                setType(e.target.value)
            }}
            >
                <option value='In-person'>
                In-person
                </option>
                <option value='Online'>
                Online
                </option>
            </select>
            <label>private: </label>
            <input type="checkbox"
            value={privates}
            onChange={(e) => {
                setPrivates(!privates)
            }}
            ></input>
            <label>city: </label>
            <input type="text"
            value={city}
            onChange={(e) => {
                setCity(e.target.value)
            }}
            ></input>
            <label>state: </label>
            <input type="text"
            value={state}
            onChange={(e) => {
                setState(e.target.value)
            }}
            ></input>
            <button
            onClick={(e) => {
                onSubmit()
            }}
            >Submit</button>
        </div> */}
        </div>
    )
}
