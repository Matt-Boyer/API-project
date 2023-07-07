import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/GET_ALL_GROUPS'
const CREATE_GROUP = 'group/CREATE_GROUP'
const GET_DETAILS_GROUP = 'group/GET_DETAILS'
const EDIT_GROUP = 'group/EDIT_GROUP'
const DELETE_GROUP = 'groups/DELETE_GROUP'
const ADD_IMAGE = 'groups/ADD_IMAGE'

const addImage = (image) => ({
    type: ADD_IMAGE,
    image
})

const deleteGroup = (groupId) => ({
    type: DELETE_GROUP,
    groupId
})

const editGroup = (data) => ({
    type: EDIT_GROUP,
    data
})

const getAllGroups = (data) => ({
    type: GET_ALL_GROUPS,
    data
})

const createGroup = (data) => ({
    type: CREATE_GROUP,
    data
})

const getDetailsGroup = (group) => ({
    type: GET_DETAILS_GROUP,
    group
})

export const thunkAddImage = (image, groupId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}/images`, {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(image)
        })
        if (response.ok)    {
            const group = await response.json()
            dispatch(addImage(group))
            return group
        }
    } catch (error) {
        const err = await error.json()
        return {errors:err}
    }
}

export const thunkDeleteGroup = (groupId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}`, {
            method:'DELETE'
        })
        if (response.ok)    {
            const res = await response.json()
            dispatch(deleteGroup(res))
            return res
        }
    } catch (error) {
        const err = await error.json()
        return {errors:err}
    }
}

export const thunkEditGroup = (groupId, data) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}`, {
            method:'PUT',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        })
        if (response.ok)    {
            const group = await response.json()
            dispatch(editGroup(group))
            return group
        }
    } catch (error) {
        const err = await error.json()
        console.log("thisisthunkerror", err)
        return {errors:err}
    }
}

export const thunkGetDetailsGroup = (groupId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}`)
        if (response.ok) {
            const result = await response.json()
            dispatch(getDetailsGroup(result))
            return result
        }
    } catch (error) {
        const err = await error.json()
        return {errors:err}
    }
}

export const thunkGetAllGroups = () => async (dispatch) => {
    const response = await csrfFetch(`/api/groups`)
    if (response.ok) {
        const result = await response.json()
        dispatch(getAllGroups(result))
        return result
    }
}

export const thunkCreateGroup = (data) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/groups`, {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        })
        if (response.ok)    {
            const group = await response.json()
            dispatch(createGroup(group))
            return group
        }
    } catch (error) {
        const err = await error.json()
        return {errors:err}
    }
}

const initialStore = {
    allGroups: {},
    singleGroup: {}
}

const groupsReducer = (state = initialStore, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            let newState = {...state, allGroups:{...state.allGroups}}
            newState.allGroups = {}
            action.data.Groups.forEach(ele => {
                newState.allGroups[ele.id]= ele
            });
            return {...newState}
        }
        case DELETE_GROUP: {
            const newState = {...state, allGroups:{...state.allGroups}}//try this to reshresh {...state,allGroups:{...state.allGroups}}
            delete newState.allGroups[action.eventId]
            return newState
        }
        case CREATE_GROUP: {
            const newState = {...state}
            newState.allGroups[action.data.id] = action.data
            return newState
        }
        case GET_DETAILS_GROUP: {
            const newState = {...state, singleGroup:{...state.singleGroup}}
            newState.singleGroup = action.group
            console.log('newstatetcase',newState)
            return newState
        }
        case EDIT_GROUP: {
            const newState = {...state, singleGroup:{...state.singleGroup}}
            newState.singleGroup = action.data
            return newState
        }
        default:
            return state;
    }
};
export default groupsReducer
