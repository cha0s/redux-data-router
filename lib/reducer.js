import { changeLocation } from "./actions.js";
const initialState = { action: null, location: null };
function reducer(state = initialState, { payload, type } = {}) {
  return type !== changeLocation.type ? state : { ...state, ...payload };
}
export {
  reducer
};
