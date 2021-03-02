import ListItem from "@material-ui/core/ListItem";
import React from "react";
import {NavLink} from "react-router-dom";
import "../../../styles/index.css";

export const NavBarItem = ({link, title, icon}) => {
  return <ListItem>
    {icon}
    <NavLink to={link} className="navbar-link">
      {title}
    </NavLink>
  </ListItem>
}
