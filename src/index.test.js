import {createMemoryRouter} from 'react-router';
import {combineReducers, compose, createStore} from 'redux';
import {beforeEach, describe, expect, test} from 'vitest';

import {
  back,
  changeLocation,
  createEnhancer,
  forward,
  go,
  goBack,
  goForward,
  locationsAreEqual,
  navigate,
  push,
  reducer,
  replace,
} from './index.js';

let actions;
let router;
let store;

function createTestCases(routerKey) {
  const routerLocationSelector = (state) => state[routerKey]?.location || null;

  beforeEach(() => {
    const routes = [
      {
        children: [
          {path: '/about'},
          {path: '/contact'},
        ],
        path: '/',
      },
    ];
    const spy = (createStore) => (reducer, initialState, enhancer) => {
      const store = createStore(reducer, initialState, enhancer);
      const {dispatch} = store;
      return {
        ...store,
        dispatch: (action) => {
          actions.push(action);
          return dispatch(action);
        },
      };
    };
    actions = [];
    router = createMemoryRouter(routes);
    // Default router key.
    if ('router' === routerKey) {
      store = createStore(
        combineReducers({router: reducer}),
        compose(createEnhancer(router), spy),
      );
    }
    // Configure it.
    else {
      store = createStore(
        combineReducers({[routerKey]: reducer}),
        compose(createEnhancer(router, {key: routerKey}), spy),
      );
    }
  });

  test('integrates with redux', () => {
    expect(router.state.location.pathname)
      .to.equal('/');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    expect(actions.length)
      .to.equal(1);
    expect(actions[0].type)
      .to.equal(changeLocation.type);
  });

  test('tracks router updates', () => {
    router.navigate('/about');
    router.navigate('/contact');
    expect(router.state.location.pathname)
      .to.equal('/contact');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    expect(actions.length)
      .to.equal(3);
    expect(actions[1].type)
      .to.equal(changeLocation.type);
    expect(actions[1].type)
      .to.equal(actions[2].type);
  });

  test('implements back action', () => {
    router.navigate('/about');
    store.dispatch(back());
    expect(router.state.location.pathname)
      .to.equal('/');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    // / -> /about -> /
    expect(actions.length)
      .to.equal(3);
  });

  test('implements forward action', () => {
    router.navigate('/about');
    store.dispatch(back());
    store.dispatch(forward());
    expect(router.state.location.pathname)
      .to.equal('/about');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    // / -> /about -> / -> /about
    expect(actions.length)
      .to.equal(4);
  });

  test('implements go action', () => {
    router.navigate('/about');
    router.navigate('/contact');
    store.dispatch(go(-2));
    expect(router.state.location.pathname)
      .to.equal('/');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    // / -> /about -> /contact -> /
    expect(actions.length)
      .to.equal(4);
  });

  test('implements goBack action', () => {
    router.navigate('/about');
    store.dispatch(goBack());
    expect(router.state.location.pathname)
      .to.equal('/');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    // / -> /about -> /
    expect(actions.length)
      .to.equal(3);
  });

  test('implements goForward action', () => {
    router.navigate('/about');
    router.navigate('/contact');
    store.dispatch(goBack());
    store.dispatch(goForward());
    expect(router.state.location.pathname)
      .to.equal('/contact');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    // / -> /about -> /contact -> /about -> /contact
    expect(actions.length)
      .to.equal(5);
  });

  test('implements push action', () => {
    store.dispatch(push('/about'));
    expect(router.state.location.pathname)
      .to.equal('/about');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    // / -> /about
    expect(actions.length)
      .to.equal(2);
    store.dispatch(push('/contact'));
    expect(router.state.location.pathname)
      .to.equal('/contact');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    // / -> /about -> /contact
    expect(actions.length)
      .to.equal(3);
  });

  test('implements replace action', () => {
    router.navigate('/about');
    store.dispatch(replace('/contact'));
    expect(router.state.location.pathname)
      .to.equal('/contact');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    // / -> /about -> /contact
    expect(actions.length)
      .to.equal(3);
  });

  test('implements navigate action', () => {
    router.navigate('/about');
    store.dispatch(navigate('/contact'));
    expect(router.state.location.pathname)
      .to.equal('/contact');
    expect(locationsAreEqual(router.state.location, routerLocationSelector(store.getState())))
      .to.be.true;
    // / -> /about -> /contact
    expect(actions.length)
      .to.equal(3);
  });

}

describe('defaults', () => {
  createTestCases('router');
});

describe('custom slice key', () => {
  createTestCases('FOO_BAR');
});
