import React from 'react';
import ThingForm from './ThingForm';
import { connect } from 'react-redux';
import { deleteThing, updateOwnerOfThing, updateThing } from './store';

const Things = ({ things, users, deleteThing, increment, updateOwnerOfThing, updateThing })=> {
  return (
    <div>
      <h1>Things</h1>
      <ul>
        {
          things.map( thing => {
            const user = users.find(user => user.id === thing.userId) || {};

            return (
              <li key={ thing.id }>
                { thing.name } ({ thing.ranking })
                owned by { user.name || 'nobody' }
                <div>
                  <select id='select' defaultValue={ thing.userId } onClick={()=>{ document.getElementById("select").selectedIndex = 0}} onChange={ ev => updateThing(ev.target.value, thing)}>
                    <option>Choose An Owner</option>
                    <option value="">nobody</option>
                    { 
                      users.map( user => {
                        return (
                          <option key={ user.id } type='reset' value={ user.id }>{ user.name }</option>
                        );
                      })
                    }
                  </select>
                </div>
                <button onClick={ ()=> deleteThing(thing)}>x</button>
                <button onClick={()=> increment(thing, -1)}>-</button>
                <button onClick={()=> increment(thing, 1)}>+</button>
                
              </li>
            );
          })
        }
      </ul>
      <ThingForm />
    </div>
  );
};

export default connect(
  (state)=> {
    return {
      things: state.things,
      users: state.users
    }
  },
  (dispatch)=> {
    return {
      // updateOwnerOfThing: (userId, thing) => {
      //   if (userId) {
      //   thing = {...thing, userId: userId * 1 };
      //   dispatch(updateOwnerOfThing(userId, thing))
      //   } else {
      //   thing = {...thing, userId: null}
      //   dispatch(updateThing(thing)); 
      //   }
      // },
      updateThing: (userId, thing) => {
        thing = {...thing, userId: userId * 1};
        dispatch(updateThing(thing))
      },
      increment: (thing, dir)=> {
        thing = {...thing, ranking: thing.ranking + dir};
        dispatch(updateThing(thing));
      },
      deleteThing: (thing)=> {
        dispatch(deleteThing(thing));
      }
    };

  }
)(Things);
