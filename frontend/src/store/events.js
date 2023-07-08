import { csrfFetch } from "./csrf";

const GET_EVENTS_OF_GROUP = 'events/GET_EVENTS_OF_GROUP'
const GET_ALL_EVENTS = 'events/GET_ALL_EVENTS'
const EVENT_DETAILS = 'events/EVENT_DETAILS'
const CREATE_EVENT = 'events/CREATE_EVENT'
const DELETE_EVENT = 'events/DELETE_EVENT'
const ADD_IMAGE_EVENT = 'events/ADD_IMAGE'

const addImageEvent = (eventId) => ({
    type: ADD_IMAGE_EVENT,
    eventId
})

const deleteEvent = (eventId) => ({
    type: DELETE_EVENT,
    eventId
})

const createEvent = (data) => ({
    type: CREATE_EVENT,
    data
})

const eventDetails = (event) => ({
    type: EVENT_DETAILS,
    event
})

const getAllEvents = (events) => ({
    type: GET_ALL_EVENTS,
    events
})

const getEventsGroup = (events) => ({
    type: GET_EVENTS_OF_GROUP,
    events
})

export const thunkAddImageEvent = (image, eventId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/events/${eventId}/images`, {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(image)
        })
        if (response.ok)    {
            const group = await response.json()
            // console.log('this is response thunk', group)
            dispatch(addImageEvent(group))
            return group
        }
    } catch (error) {
        const err = await error.json()
        // console.log('this is err from thunk',err)
        return {errors:err}
    }
}

export const thunkDeleteEvent = (eventId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/events/${eventId}`, {
            method:'DELETE'
        })
        if (response.ok)    {
            const res = await response.json()
            dispatch(deleteEvent(res))
            return res
        }
    } catch (error) {
        const err = await error.json()
        return {errors:err}
    }
}

export const thunkCreateEvent = (groupId,data) => async (dispatch) => {
    console.log('this is data think', data)
    try {
        const response = await csrfFetch(`/api/groups/${groupId}/events`, {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        })
        if (response.ok)    {
            const event = await response.json()
            dispatch(createEvent(event))
            return event
        }
    } catch (error) {
        const err = await error.json()
        return {errors:err}
    }
}

export const thunkEventDetails = (eventId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/events/${eventId}`)
        if (response.ok) {
            const result = await response.json()
            dispatch(eventDetails(result))
            return result
        }
    } catch (error) {
        const err = await error.json()
        return {errors:err}
    }
}

export const thunkGetEventsGroup = (groupId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}/events`)
        if (response.ok) {
            const result = await response.json()
            dispatch(getEventsGroup(result))
            return result
        }
    } catch (error) {
        const err = await error.json()
        return {errors:err}
    }
}

export const thunkGetAllEvents = () => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/events`)
        if (response.ok) {
            const result = await response.json()
            dispatch(getAllEvents(result))
            return result
        }
    } catch (error) {
        const err = await error.json()
        return {errors:err}
    }
}

const initialStore = {
    allEvents:{},
    singleEvent:{}
}

const eventsReducer = (state = initialStore, action) => {
    switch (action.type) {
        case GET_EVENTS_OF_GROUP: {
            const newState = {...state, allEvents:{...state.allEvents}}
            newState.allEvents ={}
            action.events.Events.forEach(ele => {
                newState.allEvents[ele.id]=ele
            });
            return newState
        }
        case DELETE_EVENT: {
            const newState = {...state, allEvents:{...state.allEvents}}
            delete newState.allEvents[action.groupId]
            return newState
        }
        case GET_ALL_EVENTS: {
            const newState = {...state, allEvents:{...state.allEvents}}
            newState.allEvents ={}
            action.events.Events.forEach(ele => {
                newState.allEvents[ele.id]=ele
            });
            return newState
        }
        case EVENT_DETAILS: {
            const newState = {...state, singleEvent:{...state.singleEvent}}///spread in this instead of what i had just empty obj
            newState.singleEvent ={}///added this reset
            newState.singleEvent = action.event
            return newState
        }
        case CREATE_EVENT: {
            const newState = {...state, allEvents:{...state.allEvents}}
            newState.allEvents[action.data.id] = action.data
            return newState
        }
        default:
            return state;
    }
};
export default eventsReducer
