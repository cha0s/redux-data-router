const LOCATION_CHANGE = "@@router/LOCATION_CHANGE";
function actionCreator(subtype, createPayload) {
  const type = `@@router/${subtype}`;
  const action = (...payload) => ({
    payload: createPayload ? createPayload(...payload) : payload[0],
    type
  });
  action.toString = () => type;
  action.type = type;
  return action;
}
const changeLocation = actionCreator(LOCATION_CHANGE);
const navigate = actionCreator("NAVIGATION", (to, state) => ({ state, to }));
const navigationAction = (creator) => actionCreator("NAVIGATION", creator);
const back = navigationAction(() => ({ to: -1 }));
const forward = navigationAction(() => ({ to: 1 }));
const go = navigationAction((to) => ({ to }));
const goBack = navigationAction(() => ({ to: -1 }));
const goForward = navigationAction(() => ({ to: 1 }));
const push = navigationAction((to, state) => ({ state, to }));
const replace = navigationAction((to, state) => ({ state: { ...state, replace: true }, to }));
export {
  LOCATION_CHANGE,
  back,
  changeLocation,
  forward,
  go,
  goBack,
  goForward,
  navigate,
  push,
  replace
};
