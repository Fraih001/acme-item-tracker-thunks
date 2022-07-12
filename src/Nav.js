import React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const Nav = ( props )=> {
  const location = useLocation();
  const { things, users } = props
  console.log(props)

  return (
    <nav>
      <Link to='/' className={ location.pathname === '/' ? 'selected': ''}>Home</Link>
      <Link to='/things' className={ location.pathname === '/things' ? 'selected': ''}>Things ({ things.length })</Link>
      <Link to='/users' className={ location.pathname === '/users' ? 'selected': ''}>Users ({ users.length })</Link>
    </nav>
  );
}

export default connect(state=>state)(Nav);
