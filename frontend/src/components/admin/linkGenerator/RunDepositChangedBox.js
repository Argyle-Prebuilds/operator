import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormHelperText } from '@material-ui/core';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {onEnterPressed} from "../../../utils/general";


export const RunDepositChangedBox = (props) => {

  const {
    routing_number,
    account_number,
    allocation_type,
    allocation_value,
    generatorErrorState,
    account_type,
    updateState,
    save
  } = props


  return <div className="extra-info-div">
    <h3 className="header">New Routing Number</h3>
    <TextField
      id="routing_number"
      name="routing_number"
      value={routing_number}
      onChange={updateState}
      onKeyPress={(evt) => onEnterPressed(evt, save)}
      className="medium-textfield"
      type="text"
      error={!!generatorErrorState.routing_number}
      helperText={generatorErrorState.routing_number}
      required
    />
    <h3 className="header">New Account Number</h3>
    <TextField
      id="account_number"
      name="account_number"
      value={account_number}
      onChange={updateState}
      onKeyPress={(evt) => onEnterPressed(evt, save)}
      className="medium-textfield"
      type="text"
      error={!!generatorErrorState.account_number}
      helperText={generatorErrorState.account_number}
      required
    />
    <h3 className="header">Account Type</h3>
      <Select
        className="medium-textfield"
        labelId="account-type-label"
        id="account_type"
        name="account_type"
        onChange={updateState}
        value={account_type}
        error={!!generatorErrorState.account_type}
        required
      >
      <MenuItem value={'checking'}>Checking</MenuItem>
      <MenuItem value={'savings'}>Savings</MenuItem>
    </Select>
    {!!generatorErrorState.account_type ? (
      <FormHelperText error={true}>
        {generatorErrorState.account_type}
      </FormHelperText>) : null}

    <h3 className="header">Allocation</h3>
    <div style={{display: 'flex'}}>
      <div className="half-width-div">
        <h3 className="sub-header">Value</h3>
        <TextField
          id="allocation_value"
          name="allocation_value"
          value={allocation_value}
          onChange={updateState}
          onKeyPress={(evt) => onEnterPressed(evt, save)}
          className="medium-textfield"
          error={!!generatorErrorState.allocation_value}
          helperText={generatorErrorState.allocation_value}
          required
          type="number"
        />
      </div>
      <div className="half-width-div">
        <h3 className="sub-header">Type</h3>
        <Select
          className="medium-textfield"
          labelId="allocation-type-label"
          id="allocation_type"
          name="allocation_type"
          onChange={updateState}
          value={allocation_type}
          error={!!generatorErrorState.allocation_type}
        >
          <MenuItem value={'percent'}>Percent</MenuItem>
          <MenuItem value={'amount'}>Amount</MenuItem>
        </Select>
        {!!generatorErrorState.allocation_type ? (
          <FormHelperText error={true}>
            {generatorErrorState.allocation_type}
        </FormHelperText>) : null}
      </div>

    </div>
  </div>
}
