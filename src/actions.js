export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

function actionCreator(subtype, createPayload) {
  const type = `@@router/${subtype}`;
  const action = (...payload) => ({
    payload: createPayload ? createPayload(...payload) : payload[0],
    type,
  });
  action.toString = () => type;
  action.type = type;
  return action;
}

export const changeLocation = actionCreator('LOCATION_CHANGE');
export const navigate = actionCreator('NAVIGATION', (to, state) => ({state, to}));

// Compatibility with history actions.
const navigationAction = (creator) => actionCreator('NAVIGATION', creator);
export const back = navigationAction(() => ({to: -1}));
export const forward = navigationAction(() => ({to: 1}));
export const go = navigationAction((to) => ({to}));
export const goBack = navigationAction(() => ({to: -1}));
export const goForward = navigationAction(() => ({to: 1}));
export const push = navigationAction((to, state) => ({state, to}));
export const replace = navigationAction((to, state) => ({state: {...state, replace: true}, to}));
