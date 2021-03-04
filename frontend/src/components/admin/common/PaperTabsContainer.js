import Paper from "@material-ui/core/Paper";
import React, {useState} from "react";
import "../../../styles/index.css";
import {Divider} from "@material-ui/core";

export const PaperTabsContainer = (props) => {

  const {tab1Title, tab2Title, tab1Component, tab2Component, mini = false} = props
  const [tab, setTab] = useState(1)

  return <div className={`main-container ${mini && 'mini'}`}>
    <Paper className="paper-container">
      <div className="tabs-navbar">
        <div className={tab === 1 ? "tab-name" : "tab-name inactive-tab"}
             onClick={() => setTab(1)}>
          <h2>{tab1Title}</h2>
        </div>
        <div className={tab === 2 ? "tab-name" : "tab-name inactive-tab"}
             onClick={() => setTab(2)}>
          <h2>{tab2Title}</h2>
        </div>
      </div>
      <Divider/>
      <div className="tab-panel">
        {tab === 1 && tab1Component}
        {tab === 2 && tab2Component}
      </div>
    </Paper>

  </div>
}
