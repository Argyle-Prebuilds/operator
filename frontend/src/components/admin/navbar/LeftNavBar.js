import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import "../../../styles/index.css";
import {NavBarItem} from "./NavBarItem";
import {Divider} from "@material-ui/core";
import DashboardIcon from '@material-ui/icons/Dashboard';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import MailIcon from '@material-ui/icons/Mail';
import LinkIcon from '@material-ui/icons/Link';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PeopleIcon from '@material-ui/icons/People';
const drawerWidth = 200

export const LeftNavBar = () => {
  return <Drawer variant="permanent" anchor={"left"} style={{
    width: drawerWidth,
    flexShrink: 0,
  }}>
    <List className='menu-container'>
      <NavBarItem link="/admin/accounts/" title="Admin List" icon={<SupervisorAccountIcon/>}/>
      <NavBarItem link="/admin/homepage" title="Homepage" icon={<DashboardIcon/>}/>
      <NavBarItem link="/admin/api-keys" title="API" icon={<VpnKeyIcon/>}/>
      <NavBarItem link="/admin/user-edits" title="User Edits" icon={<MailIcon/>}/>
      <NavBarItem link="/admin/generator" title="Generator" icon={<LinkIcon/>}/>
      <NavBarItem link="/admin/user-list" title="User List" icon={<PeopleIcon/>}/>
      <Divider className="padded-divider"/>
      <NavBarItem link="/admin/logout" title="Logout" icon={<PowerSettingsNewIcon/>}/>
    </List>

  </Drawer>
}
