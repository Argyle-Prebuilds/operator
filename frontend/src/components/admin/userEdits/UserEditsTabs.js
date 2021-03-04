import React from "react";
import {PaperTabsContainer} from "../common/PaperTabsContainer";
import {UserEditsEmail} from "./UserEditsEmail";
import {UserEditsSms} from "./UserEditsSms";

export const UserEditsTabs = () => {

  return <PaperTabsContainer tab1Title="Invitation Email Editor"
                             tab2Title="Invitation SMS Editor"
                             tab1Component={<UserEditsEmail/>}
                             tab2Component={<UserEditsSms/>}
  />


}
