import { changeLocation, navigate } from "./actions";
function locationsAreEqual(l, r) {
  if (!l && !r) {
    return true;
  }
  if (l && !r || !l && r) {
    return false;
  }
  return ["pathname", "search", "hash"].every((key) => l[key] === r[key]);
}
function createEnhancer(router, { key = "router" } = {}) {
  const routerLocationSelector = (state) => state[key]?.location || null;
  return (createStore) => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, initialState, enhancer);
    const { historyAction: action, location } = router.state;
    store.dispatch(changeLocation({ action, location }));
    let isNavigatingSynthetically = false;
    router.subscribe(({ historyAction: action2, location: location2 }) => {
      if (isNavigatingSynthetically) {
        return;
      }
      if (!locationsAreEqual(location2, routerLocationSelector(store.getState()))) {
        store.dispatch(changeLocation({ action: action2, location: location2 }));
      }
    });
    store.subscribe(() => {
      isNavigatingSynthetically = true;
      const location2 = routerLocationSelector(store.getState());
      if (location2 && !locationsAreEqual(location2, router.state.location)) {
        router.navigate(location2);
      }
      isNavigatingSynthetically = false;
    });
    const { dispatch } = store;
    return {
      ...store,
      dispatch: (action2) => {
        if (action2.type === navigate.type) {
          const { state, to } = action2.payload;
          router.navigate(to, state);
          return void 0;
        }
        return dispatch(action2);
      }
    };
  };
}
export {
  createEnhancer,
  locationsAreEqual
};
