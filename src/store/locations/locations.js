import { combineReducers } from "redux";

const ADD_LOCATION = 'ADD_LOCATION';

export function addLocation(location) {
    return {
        type: ADD_LOCATION,
        location,
    }
}

const defaultLocations = [
    {
        name: 'KLCC (Kuala Lumpur Convention Centre), Kuala Lumpur (example)',
    }
];

function locations(state=defaultLocations, action) {
    switch (action.type) {
        case ADD_LOCATION:
            return [
                ...state,
                {
                    name: action.location,
                }
            ];
        default: 
            return state;
    }
}

const locationApp = combineReducers({
    locations
});

export default locationApp;