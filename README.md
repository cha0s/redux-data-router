![CI](https://github.com/cha0s/redux-data-router/actions/workflows/ci.yml/badge.svg)

# ⚙️ `redux-data-router` 🔩

**`redux-data-router`** is a clean-room spiritual successor to projects like
**redux-first-history**.

You only need to bring your **React Router v6** data  `router`, no need to manage a `history` object (or use `UNSTABLE_`
methods :smile:)

## Usage with `router`

```js
import {createEnhancer, reducer} from 'redux-data-router';

// Create your data router like normal.
const router = createBrowserRouter(routes);
// Install the router reducer and enhancer.
const store = configureStore(
  reducer: {router: reducer}, // Install the reducer at the 'router' slice by default.
  enhancers: [createEnhancer(router)],
);
```

Redux is now connected to React Router! Yes, that's it.

## Backwards-compatible

Effort has been made to keep the history action types working. **`redux-data-router`** exports
all the actions you know and love:

```js
dispatch(back());
dispatch(forward());
dispatch(go(2));
dispatch(goBack(2));
dispatch(goForward());
dispatch(push('/', state || {}));
dispatch(replace('/about'));
```

There is a new `navigate` action that is more semantically in line with how the modern
router actually works:

```js
dispatch(navigate('/about'));
dispatch(navigate('/about', {replace: true}));
dispatch(navigate(2));
```

### Under the hood

History actions are casted to an equivalent `navigate` action. See:
[`actions.js`](./src/actions.js#L16)

### Does this support time-travelling?

Yes. :grin: Router navigation is a side-effect of every location state change.

## Configuration

`createEnhancer` takes an optional options object after your `router`:

```js
{
  // The key used for the router slice.
  key: 'router',
}
```

For example, the introduction could have been configured differently for your unique state
structure:

```js
const store = configureStore(
  reducer: {FOO_BAR: reducer},
  enhancers: [createEnhancer(router, {key: 'FOO_BAR'})],
);
```

## How it works

Up to now, libraries have been handling a `history` object to synchronize Redux state with React
Router. This approach is no longer practical with current (February 2024) React Router data router
semantics.

All is not lost, however! Instead of `history.listen`, we have a new API: `router.subscribe`.
**`redux-data-router`** subscribes to changes through this channel to continuously synchronize the
Redux state with the router state.

### Is this a *real* single source of truth?

Probably not. React Router's internals aren't always easy to get into, and there may even be
issues with the approach taken here. If e.g. the internal `updateState` API were made
public, we might be able to become a true SSOT.

## Contributing

```
npm ci
npm run lint && npm run test
```