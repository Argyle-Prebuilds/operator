import Paper from "@material-ui/core/Paper";
import React from "react";
import "../../../styles/index.css";

//custom component to use in every subpage of app to have the common styles

export const PaperContainer = ({ title, children, mini = false }) => {
  return (
    <div className={`main-container ${mini && "mini"}`}>
      <Paper className="paper-container">
        <h2 className="page-title">{title}</h2>
        {children}
      </Paper>
    </div>
  );
};
