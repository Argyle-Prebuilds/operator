import Paper from "@material-ui/core/Paper";
import React from "react";
import "../../../styles/index.css";
import {Divider} from "@material-ui/core";

//custom component to use in every subpage of app to have the common styles

export const PaperContainer = ({title, children, mini = false}) => {

  return <div className={`main-container ${mini && 'mini'}`}>
    <Paper className="paper-container">
      <div className="page-title">
        <h2>{title}</h2>
        <Divider/>
      </div>
      {children}
    </Paper>
  </div>
}
