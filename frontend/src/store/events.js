import { csrfFetch } from "./csrf";

const GET_EVENTS_OF_GROUP = 'events/GET_EVENTS_OF_GROUP'

const getEventsGroup = (events) => ({
    type: GET_EVENTS_OF_GROUP,
    events
})

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

const initialStore = {
    allEvents:{},
    singleEvent:{}
}

const eventsReducer = (state = initialStore, action) => {
    switch (action.type) {
        case GET_EVENTS_OF_GROUP: {
            const newState = {...state, allEvents:{}}
            action.events.Events.forEach(ele => {
                newState.allEvents[ele.id]=ele
            });
            return newState
        }
        default:
            return state;
    }
};
export default eventsReducer
