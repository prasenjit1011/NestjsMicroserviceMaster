import ReactDOM from 'react-dom/client';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore,  createSlice,  PayloadAction} from '@reduxjs/toolkit';

type CounterState = {  value: number;};
const initialState: CounterState = {  value: 0};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (newstate)   => {    newstate.value  += Math.floor(Math.random() * 100);   },
    decrement: (demostate)  => {    demostate.value -= Math.floor(Math.random() * 100);  },
  },
});

const { increment, decrement } = counterSlice.actions;
const store     = configureStore({  reducer: {counter: counterSlice.reducer }});
type RootState  = ReturnType<typeof store.getState>;

function App() {
  const count       = useSelector((devstate: RootState) => devstate.counter.value);
  const dispatch    = useDispatch();

  return (
    <div>
      <h1>Cnt: {count}</h1>
      <button onClick={() => dispatch(increment())} style={{ fontSize: '2em', padding: '0.5em 1em', cursor: 'pointer'}}>
        +
      </button> &nbsp;
      <button onClick={() => dispatch(decrement())} style={{ fontSize: '2em', padding: '0.5em 1em', cursor: 'pointer'}}>
        -
      </button>
    </div>
  );
}

// Render
ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <Provider store={store}>
    <App />
  </Provider>
);