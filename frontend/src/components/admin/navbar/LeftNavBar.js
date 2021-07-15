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

import { ReactComponent as Admin } from "../../../icons/menu/Admin.svg";
import { ReactComponent as AdminActive } from "../../../icons/menu/AdminActive.svg";

import { ReactComponent as Home } from "../../../icons/menu/Home.svg";
import { ReactComponent as HomeActive } from "../../../icons/menu/HomeActive.svg";

import { ReactComponent as API } from "../../../icons/menu/API.svg";
import { ReactComponent as APIActive } from "../../../icons/menu/APIActive.svg";

import { ReactComponent as Mail } from "../../../icons/menu/Mail.svg";
import { ReactComponent as MailActive } from "../../../icons/menu/MailActive.svg";

import { ReactComponent as Generator } from "../../../icons/menu/Generator.svg";
import { ReactComponent as GeneratorActive } from "../../../icons/menu/GeneratorActive.svg";

import { ReactComponent as UserList } from "../../../icons/menu/UserList.svg";
import { ReactComponent as UserListActive } from "../../../icons/menu/UserListActive.svg";

import { ReactComponent as Logo } from "../../../icons/Logo.svg";
import { ReactComponent as Logout } from "../../../icons/menu/Logout.svg";


const drawerWidth = 200

export const LeftNavBar = () => {
  return (
    <Drawer
      variant="permanent"
      anchor={"left"}
      style={{
        width: drawerWidth,
        flexShrink: 0,
      }}
    >
      <NavBarItem
        link="/"
        title=""
        icon={<Logo />}
        activeIcon={<Logo />} />
      <List className="menu-container">
        <NavBarItem
          link="/admin/accounts/"
          title="Admin List"
          icon={<Admin />}
          activeIcon={<AdminActive />}
        />
        <NavBarItem
          link="/admin/homepage"
          title="Homepage"
          icon={<Home />}
          activeIcon={<HomeActive />}
        />
        <NavBarItem
          link="/admin/api-keys"
          title="API"
          icon={<API />}
          activeIcon={<APIActive />}
        />
        <NavBarItem
          link="/admin/user-edits"
          title="User Edits"
          icon={<Mail />}
          activeIcon={<MailActive />}
        />
        <NavBarItem
          link="/admin/generator"
          title="Generator"
          icon={<Generator />}
          activeIcon={<GeneratorActive />}
        />
        <NavBarItem
          link="/admin/user-list"
          title="User List"
          icon={<UserList />}
          activeIcon={<UserListActive />}
        />
        <div style={{ position: "fixed", bottom: 30}}>
          <NavBarItem link="/admin/logout" title="Logout" icon={<Logout />} />
        </div>
      </List>
    </Drawer>
  );
}
