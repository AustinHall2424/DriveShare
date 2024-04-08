import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  width: 1440px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #00bfff;
  color: #f0f8ff;
  padding: 1rem;
`;

const NavItem = styled.li`
  list-style: none;
  margin: 0 1rem;

  a {
    color: #fff;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: #bada55;
    }
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const NavBar = () => {
  return (
    <Nav>
      <Logo>DriveShare App</Logo>
      <ul>
        <NavItem><a href="/dashboard">Home</a></NavItem>
        <NavItem><a href="/dashboard/payment">Payment</a></NavItem>
      </ul>
    </Nav>
  );
};

export default NavBar;