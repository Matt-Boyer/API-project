import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/GET_ALL_GROUPS'
const CREATE_GROUP = 'group/CREATE_GROUP'
const GET_DETAILS_GROUP = 'group/GET_DETAILS'



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
            let newState = {...state}
            action.data.Groups.forEach(ele => {
                newState.allGroups[ele.id]= ele
            });
            return {...newState}
        }
        case CREATE_GROUP: {
            const newState = {...state}
            newState.allGroups[action.data.id]=action.data
            return newState
        }
        case GET_DETAILS_GROUP: {
            return {...state,singleGroup:{...action.group}}
        }
        default:
            return state;
    }
};
export default groupsReducer
