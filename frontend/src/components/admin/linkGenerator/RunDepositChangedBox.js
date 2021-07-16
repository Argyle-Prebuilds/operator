import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormHelperText, InputLabel, FormControl } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { onEnterPressed } from "../../../utils/general";

export const RunDepositChangedBox = (props) => {
  const {
    routing_number,
    account_number,
    allocation_type,
    allocation_value,
    generatorErrorState,
    account_type,
    updateState,
    save,
  } = props;

  return (
    <div className="direct-deposit extra-info-div">
      {/* <div className="direct-deposit"> */}
      <div className="direct-deposit-box">
        <h3 className="header">Set Integrations</h3>
        <div className="direct-deposit-row">
          <TextField
            id="routing_number"
            name="routing_number"
            label="New Routing"
            variant="outlined"
            value={routing_number}
            onChange={updateState}
            onKeyPress={(evt) => onEnterPressed(evt, save)}
            className="medium-textfield"
            type="text"
            error={!!generatorErrorState.routing_number}
            helperText={generatorErrorState.routing_number}
            required
            className="small-input"
          />
          <TextField
            id="account_number"
            name="account_number"
            label="New Account"
            variant="outlined"
            value={account_number}
            onChange={updateState}
            onKeyPress={(evt) => onEnterPressed(evt, save)}
            className="medium-textfield"
            type="text"
            error={!!generatorErrorState.account_number}
            helperText={generatorErrorState.account_number}
            required
            className="small-input"
          />
        </div>
        <FormControl variant="outlined">
          <InputLabel id="account-type-label">Account Type</InputLabel>
          <Select
            className="medium-textfield"
            labelId="account-type-label"
            id="account_type"
            name="account_type"
            label="Account Type"
            onChange={updateState}
            value={account_type}
            error={!!generatorErrorState.account_type}
            required
            className="big-input"
          >
            <MenuItem value={"checking"}>Checking</MenuItem>
            <MenuItem value={"savings"}>Savings</MenuItem>
          </Select>
        </FormControl>
        {!!generatorErrorState.account_type ? (
          <FormHelperText error={true}>
            {generatorErrorState.account_type}
          </FormHelperText>
        ) : null}
      </div>
      <div className="direct-deposit-box" style={{ width: 426 }}>
        <h3 className="header">Allocation</h3>
        <div className="direct-deposit-row">
          <TextField
            id="allocation_value"
            name="allocation_value"
            label="Value"
            variant="outlined"
            value={allocation_value}
            onChange={updateState}
            onKeyPress={(evt) => onEnterPressed(evt, save)}
            className="medium-textfield"
            error={!!generatorErrorState.allocation_value}
            helperText={generatorErrorState.allocation_value}
            required
            type="number"
            className="small-input"
          />
          <FormControl variant="outlined">
            <InputLabel id="allocation-type-label">Type</InputLabel>
            <Select
              className="medium-textfield"
              labelId="allocation-type-label"
              id="allocation_type"
              name="allocation_type"
              label="Type"
              variant="outlined"
              onChange={updateState}
              value={allocation_type}
              error={!!generatorErrorState.allocation_type}
              className="big-input"
            >
              <MenuItem value={"percent"}>Percent</MenuItem>
              <MenuItem value={"amount"}>Amount</MenuItem>
            </Select>
            {!!generatorErrorState.allocation_type ? (
              <FormHelperText error={true}>
                {generatorErrorState.allocation_type}
              </FormHelperText>
            ) : null}
          </FormControl>
        </div>
      </div>
    </div>
  );
};
