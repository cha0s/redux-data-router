import {changeLocation, navigate} from './actions';

// Test two location objects for equality.
export function locationsAreEqual(l, r) {
  if (!l && !r) {
    return true;
  }
  if ((l && !r) || (!l && r)) {
    return false;
  }
  return ['pathname', 'search', 'hash'].every((key) => l[key] === r[key]);
}

// Enhance the redux store to track and control React Router v6.
export function createEnhancer(router, {key = 'router'} = {}) {
  const routerLocationSelector = (state) => state[key]?.location || null;
  return (createStore) => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, initialState, enhancer);
    // Initial location action.
    const {historyAction: action, location} = router.state;
    store.dispatch(changeLocation({action, location}));
    // Listen for router updates. We track our "synthetic" navigations to prevent infinite
    // recursion.
    let isNavigatingSynthetically = false;
    router.subscribe(({historyAction: action, location}) => {
      if (isNavigatingSynthetically) {
        return;
      }
      if (!locationsAreEqual(location, routerLocationSelector(store.getState()))) {
        store.dispatch(changeLocation({action, location}));
      }
    });
    // Router location is always dependent on current state.
    store.subscribe(() => {
      isNavigatingSynthetically = true;
      const location = routerLocationSelector(store.getState());
      if (location && !locationsAreEqual(location, router.state.location)) {
        router.navigate(location);
      }
      isNavigatingSynthetically = false;
    });
    // Pseudo-middleware: navigate actions navigate the router as a side-effect.
    const {dispatch} = store;
    return {
      ...store,
      dispatch: (action) => {
        if (action.type === navigate.type) {
          const {state, to} = action.payload;
          router.navigate(to, state);
          return undefined;
        }
        return dispatch(action);
      },
    };
  };
}
