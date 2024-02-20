import {changeLocation} from './actions';

const initialState = {action: null, location: null};
export function reducer(state = initialState, {payload, type} = {}) {
  return type !== changeLocation.type ? state : {...state, ...payload};
}
