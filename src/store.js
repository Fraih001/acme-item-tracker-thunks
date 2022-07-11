import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import axios from 'axios';
import { faker } from '@faker-js/faker'

// const initialState = {
//   view: window.location.hash.slice(1),
//   users: [],
//   things: []
// };

const viewReducer = (state =window.location.hash.slice(1), action)=> { 
  if(action.type === 'SET_VIEW'){
    return action.view;
  }
  return state;
};

const usersReducer = (state = [], action)=> { 
  if(action.type === 'DELETE_USER'){
    return state.filter(user => user.id !== action.user.id )
  }
  if(action.type === 'SET_USERS'){
    return action.users.sort((a,b)=> a.ranking - b.ranking);
  }
  if(action.type === 'UPDATE_USER'){
    return state.map(user => user.id !== action.user.id ? user : action.user).sort((a,b)=> a.ranking - b.ranking);
  }
  if(action.type === 'CREATE_USER'){
    const sortedUsers = [...state, action.user].sort((a,b)=> a.ranking - b.ranking);
    return [ ...sortedUsers ]; 
  }
  return state;
};

const thingsReducer = (state = [], action)=> { 
  if(action.type === 'DELETE_THING'){
    return state.filter(thing => thing.id !== action.thing.id);
  }
  if(action.type === 'UPDATE_THING'){
    return state.map(thing => thing.id !== action.thing.id ? thing : action.thing).sort((a,b)=> a.ranking - b.ranking);
  }
  if(action.type === 'UPDATE_OWNER_OF_THING'){
    return state.map(thing => thing.id !== action.thing.id ? thing : action.thing).sort((a,b)=> a.ranking - b.ranking);
  }
  if(action.type === 'SET_THINGS'){
    return action.things.sort((a,b)=> a.ranking - b.ranking);
  }
  if(action.type === 'CREATE_THING'){
    const sortedThings = [...state, action.thing].sort((a,b)=> a.ranking - b.ranking);
    return [ ...sortedThings ]; 
  }
  // if(action.type === undefined){
  //   return state.sort((a,b)=> a.ranking - b.ranking);
  // }
  return state;
};

const reducer = combineReducers({
  users: usersReducer,
  things: thingsReducer,
  view: viewReducer
});

const setView = (view) => {
  return async(dispatch) => {
    dispatch({ type: 'SET_VIEW', view });
  }
}

const loadData = () => {
  return async(dispatch) => {
    const responses = await Promise.all([
      axios.get('/api/users'),
      axios.get('/api/things'),
    ]);
    dispatch({
      type: 'SET_USERS',
      users: responses[0].data
    });
    dispatch({
      type: 'SET_THINGS',
      things: responses[1].data
    });
  }
}

const createThing = () => {
  return async(dispatch)=>{
    const response = await axios.post('/api/things', { name: faker.commerce.product()});
    const thing = response.data;
    dispatch({ type: 'CREATE_THING', thing });
  }
}

// const updateThing = (thing)=> {
//   return async(dispatch)=> {
//     thing = (await axios.put(`/api/things/${thing.id}`, thing)).data;
//     dispatch({ type: 'UPDATE_THING', thing });
//   };
// };

const updateThing = (thing)=> {
  return async(dispatch, getState)=> {
    if((getState().things.filter(_thing => thing.userId === _thing.userId)).length > 2){
      alert('THIS IS AN ALERT. A USER CAN ONLY OWN THREE THINGS.');
      document.getElementById("select").selectedIndex = 0;
      return
    }else{
    thing = (await axios.put(`/api/things/${thing.id}`, thing)).data;
    dispatch({ type: 'UPDATE_THING', thing });
  }};
};

// const updateThing1 = (thing) => {
//   return async (dispatch) => {
//     try {
//       thing = axios.data
//     } catch (er) {
//       if (err.response.data === "ERROR: A user")
//     }
// dispatch
//   }
// }

// const updateOwnerOfThing = (userId, thing)=> {
//   return async(dispatch)=> {
//     thing = (await axios.put(`/api/user/${userId}/things/${thing.id}`, thing)).data;
//     dispatch({ type: 'UPDATE_OWNER_OF_THING', thing });
//   };
// };

const deleteThing = (thing)=> {
  return async(dispatch)=> {
    await axios.delete(`/api/things/${thing.id}`);
    dispatch({ type: 'DELETE_THING', thing });
  };
};

const createUser = () => {
  return async(dispatch) => {
    const response = await axios.post('/api/users', { name: faker.name.firstName()});
    const user = response.data
    dispatch({type: 'CREATE_USER', user})
  }
}

const updateUser = (user)=> {
  return async(dispatch)=> {
    user = (await axios.put(`/api/users/${user.id}`, user)).data;
    dispatch({ type: 'UPDATE_USER', user });
  };
};

const deleteUser = (userId) => {
  return async(dispatch) => {
    await axios.delete(`/api/users/${userId}`)
    dispatch({ type: 'DELETE_USER', userId })
  }
}

const removeThingFromUser = (thing) => {
  return async(dispatch) => {
  thing = {...thing, userId: null}
  const updatedThing = (await axios.put(`/api/things/${thing.id}`, thing)).data
  dispatch({ type: 'UPDATE_THING', thing: updatedThing});
}}



const store = createStore(reducer, applyMiddleware(logger, thunk));

export { deleteThing, updateThing, deleteUser, createUser, removeThingFromUser, createThing, setView, loadData, updateUser };

export default store;

