import ListItem from "@material-ui/core/ListItem";
import React from "react";
import {NavLink, useHistory} from "react-router-dom";
import "../../../styles/index.css";

export const NavBarItem = ({link, title, icon, activeIcon}) => {
  const path = useHistory()

  return (
    <ListItem>
      {path.location.pathname === link ? activeIcon : icon}
      <NavLink to={link} className="navbar-link">
        {title}
      </NavLink>
    </ListItem>
  );
}
