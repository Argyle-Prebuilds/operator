import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

export const CustomTooltip = (props) => {
  const {children, disabled, title, placement} = props;

  if (disabled) {
    return children

  }
  return <Tooltip title={title} placement={placement}>
    {children}
  </Tooltip>
}
