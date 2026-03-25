import React from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { configureStore, createSlice } from "@reduxjs/toolkit"

import { createEpicMiddleware, ofType } from "redux-observable"
import { mergeMap, map } from "rxjs/operators"
import { from } from "rxjs"

/* ---------------- SLICE ---------------- */

const userSlice = createSlice({
  name: "users",
  initialState: { list: [] },
  reducers: {

    loadUsers: (state) => {},

    setUsers: (state, action) => {
      state.list = action.payload
    }

  }
})

const { loadUsers, setUsers } = userSlice.actions

/* ---------------- API ---------------- */

const fetchUsers = () =>
  fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())

/* ---------------- EPIC ---------------- */

const loadUsersEpic = (action$) =>
  action$.pipe(

    ofType(loadUsers.type),

    mergeMap(() =>
      from(fetchUsers()).pipe(
        map(users => setUsers(users))
      )
    )

  )

/* ---------------- STORE ---------------- */

const epicMiddleware = createEpicMiddleware()

const store = configureStore({
  reducer: {
    users: userSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(epicMiddleware)
})

epicMiddleware.run(loadUsersEpic)

/* ---------------- COMPONENT ---------------- */

function App(){

  const dispatch = useDispatch()
  const users = useSelector(state => state.users.list)

  return (

    <div style={{padding:"20px"}}>

      <h2>Redux Observable + Redux Toolkit</h2>

      <button onClick={() => dispatch(loadUsers())}>
        Load Users
      </button>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>

    </div>

  )
}

/* ---------------- ROOT ---------------- */

export default function Root(){
  return(
    <Provider store={store}>
      <App/>
    </Provider>
  )
}


// import React from "react";
// import { createStore, applyMiddleware } from "redux";
// import { Provider, useDispatch, useSelector } from "react-redux";
// import createSagaMiddleware from "redux-saga";
// import { takeLatest, put, call } from "redux-saga/effects";

// /* reducer */

// const reducer = (state = { users: [] }, action) => {
//   if (action.type === "SET_USERS") {
//     return { users: action.payload };
//   }

//   return state;
// };

// /* api */

// const getUsers = () =>
//   fetch("https://jsonplaceholder.typicode.com/users")
//     .then(res => res.json());

// /* saga */

// function* loadUsers() {

//   const users = yield call(getUsers);

//   yield put({
//     type: "SET_USERS",
//     payload: users
//   });
// }

// function* rootSaga() {
//   yield takeLatest("LOAD_USERS", loadUsers);
// }

// /* store */
// const sagaMiddleware = createSagaMiddleware();
// const store = createStore(reducer,applyMiddleware(sagaMiddleware));
// sagaMiddleware.run(rootSaga);

// /* component */

// function App() {

//   const dispatch = useDispatch();
//   const users = useSelector(state => state.users);

//   return (
//     <div>

//       <button onClick={() => dispatch({ type: "LOAD_USERS" })}>
//         Load Users
//       </button>

//       <ul>
//         {users.map(user => (
//           <li key={user.id}>{user.name}</li>
//         ))}
//       </ul>

//     </div>
//   );
// }

// /* provider */

// export default function Root() {

//   return (
//     <Provider store={store}>
//       <App />
//     </Provider>
//   );
// }









// import React, { useState } from "react"
// import { createStore, applyMiddleware } from "redux"
// import { Provider, useDispatch, useSelector } from "react-redux"
// import createSagaMiddleware from "redux-saga"
// import { takeLatest, put, call } from "redux-saga/effects"

// /* ---------------- ACTION TYPES ---------------- */

// const SEARCH_USER = "SEARCH_USER"
// const SEARCH_SUCCESS = "SEARCH_SUCCESS"

// /* ---------------- REDUCER ---------------- */

// const initialState = {
//   users: []
// }

// function reducer(state = initialState, action) {

//   switch (action.type) {

//     case SEARCH_SUCCESS:
//       return {
//         ...state,
//         users: action.payload
//       }

//     default:
//       return state
//   }
// }

// /* ---------------- API ---------------- */

// const fetchUsers = () =>
//   fetch("https://jsonplaceholder.typicode.com/users")
//     .then(res => res.json())

// /* ---------------- SAGA ---------------- */

// function* searchUserSaga(action) {

//   const users = yield call(fetchUsers)

//   const filtered = users.filter(user =>
//     user.name.toLowerCase().includes(action.payload.toLowerCase())
//   )

//   yield put({
//     type: SEARCH_SUCCESS,
//     payload: filtered
//   })
// }

// function* rootSaga() {
//   yield takeLatest(SEARCH_USER, searchUserSaga)
// }

// /* ---------------- STORE ---------------- */

// const sagaMiddleware = createSagaMiddleware()

// const store = createStore(
//   reducer,
//   applyMiddleware(sagaMiddleware)
// )

// sagaMiddleware.run(rootSaga)

// /* ---------------- COMPONENT ---------------- */

// function SearchUsers() {

//   const dispatch = useDispatch()
//   const users = useSelector(state => state.users)

//   const [text, setText] = useState("")

//   const handleSearch = (e) => {

//     const value = e.target.value
//     setText(value)

//     dispatch({
//       type: SEARCH_USER,
//       payload: value
//     })
//   }

//   return (
//     <div>

//       <h2>User Search</h2>

//       <input
//         value={text}
//         onChange={handleSearch}
//         placeholder="Search user"
//       />

//       <ul>
//         {users.map(user => (
//           <li key={user.id}>
//             {user.name}
//           </li>
//         ))}
//       </ul>

//     </div>
//   )
// }

// /* ---------------- APP ---------------- */

// export default function App() {

//   return (
//     <Provider store={store}>
//       <SearchUsers />
//     </Provider>
//   )
// }