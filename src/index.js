import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import Nav from './Nav';
import Users from './Users';
import Things from './Things';
import Home from './Home';
import store, { loadData } from './store';
import { Provider, connect } from 'react-redux';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

const root = createRoot(document.querySelector('#app'));

class _App extends Component{
  async componentDidMount(){
    try {
      this.props.loadData();
    }
    catch(ex){
      console.log(ex);
    }
  }
  render(){
    return (
        <div>
        <Nav/>

          <Routes>
              <Route element ={ <Home/> } path='/' exact />
              <Route element={ <Things/> } path='/things' exact/>
              <Route element ={ <Users/> } path='/users' exact/>
          </Routes>
        </div>
    );
  }
}
const mapDispatch = (dispatch)=> {
  return {
    loadData: ()=> {
      dispatch(loadData())
  }}
}

const mapStateToProps = (state) => state;

const App = connect(mapStateToProps, mapDispatch)(_App);

root.render(<Router><Provider store={ store }><App/></Provider></Router>);
/*
const root = document.querySelector('#app');
render(React.createElement('hr'), root);
*/
