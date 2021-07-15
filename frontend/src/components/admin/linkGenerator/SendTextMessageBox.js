import TextField from "@material-ui/core/TextField";
import React from "react";
import {onEnterPressed} from "../../../utils/general";

export const SendTextMessageBox = (props) => {

  const {user_phone_number, updateState, save} = props

  return (
    <div className="extra-info-div">
      <TextField
        id="user_phone_number"
        name="user_phone_number"
        label="User's phone number"
        variant="outlined"
        helperText="Pass phone number with the country code (e.g., +12025550122)"
        value={user_phone_number}
        onChange={updateState}
        onKeyPress={(evt) => onEnterPressed(evt, save)}
        className="big-input"
        required
      />
    </div>
  );
}
