import TextField from "@material-ui/core/TextField";
import React from "react";
import {onEnterPressed} from "../../../utils/general";

export const SendTextMessageBox = (props) => {

  const {user_phone_number, updateState, save} = props

  return <div className="extra-info-div">
    <h3 className="header">User's phone number</h3>
    <p className="small-text">Pass phone number with the country code (e.g., +12025550122)</p>
    <TextField
      id="user_phone_number"
      name="user_phone_number"
      value={user_phone_number}
      onChange={updateState}
      onKeyPress={(evt) => onEnterPressed(evt, save)}
      className="medium-textfield"
      required
    /></div>
}
