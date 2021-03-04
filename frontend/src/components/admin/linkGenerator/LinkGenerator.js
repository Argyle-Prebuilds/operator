import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {Button} from "@material-ui/core";
import "../../../styles/index.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import {GENERATOR_ACCOUNT_INITIAL_STATE, GENERATOR_INITIAL_STATE, OPTIONAL_GENERATOR_FIELDS} from "../../../consts";
import {generateUserLink} from "../../../services/AdminServices";
import {displayErrorNotifications, renderNotification} from "../../../utils/display-error-notifications";
import {PaperContainer} from "../common/PaperContainer";
import {onEnterPressed} from "../../../utils/general";
import {SendTextMessageBox} from "./SendTextMessageBox";
import {SetIntegrationBox} from "./SetIntegrationBox";
import {RunDepositChangedBox} from "./RunDepositChangedBox";


export const LinkGenerator = () => {
  const [generatorState, setGeneratorState] = useState(GENERATOR_INITIAL_STATE)
  const [generatorErrorState, setGeneratorErrorState] = useState(GENERATOR_INITIAL_STATE)
  const [optionalFieldsState, setOptionalFieldsState] = useState(OPTIONAL_GENERATOR_FIELDS)
  const [loading, setLoading] = useState(false)

  const {
    user_full_name,
    user_email,
    user_phone_number,
    pay_distribution_data
  } = generatorState

  const {
    routing_number,
    account_number,
    allocation_type,
    allocation_value,
    account_type
  } = pay_distribution_data

  const {
    send_text_message,
    set_integration,
    run_deposit_changed
  } = optionalFieldsState

  const updatePayConfigState = (event) => {
    setGeneratorState({
      ...generatorState,
      pay_distribution_data: {
        ...pay_distribution_data,
        [event.target.name]: event.target.value,
      }
    });
    setGeneratorErrorState({
      ...generatorErrorState,
      pay_distribution_data: {
        ...pay_distribution_data,
        [event.target.name]: "",
      }
    });
  };

  const updateState = (event) => {
    setGeneratorState({
      ...generatorState,
      [event.target.name]: event.target.value,
    });
    setGeneratorErrorState({
      ...generatorErrorState,
      [event.target.name]: ''
    })
  };

  const updateStateByKey = (key, value) => {
    setGeneratorState({
      ...generatorState,
      [key]: value,
    });
    setGeneratorErrorState({
      ...generatorErrorState,
      [key]: ''
    })
  }

  const updateErrors = (errors) => {
    let errorList = {...GENERATOR_INITIAL_STATE};
    for (let key of Object.keys(errors)) {
      errorList[key] = errors[key];
      if (key === 'pay_distribution_data') {
        const pay_distribution_data = errorList[key]
        for (let key of Object.keys(pay_distribution_data)) {
          errorList[key] = pay_distribution_data[key]
        }
      }
    }
    setGeneratorErrorState(errorList);
  }

  const updateOptionalFieldsState = (event) => {
    if (event.target.name === 'run_deposit_changed' && event.target.checked) {
      setGeneratorState({
        ...generatorState,
        pay_distribution_data: {
          ...pay_distribution_data,
          allocation_type: 'amount',
          account_type: 'checking'
        }
      })
    }
    if (event.target.name === 'run_deposit_changed' && !event.target.checked) {
      setGeneratorState({
        ...generatorState,
        pay_distribution_data: GENERATOR_ACCOUNT_INITIAL_STATE
      })
    }

    setOptionalFieldsState({
      ...optionalFieldsState,
      [event.target.name]: event.target.checked,
    });
  };

  const save = () => {
    setLoading(true)
    const cleanGeneratorState = {...generatorState}

    if (!run_deposit_changed) {
      delete cleanGeneratorState['pay_distribution_data']
    }

    generateUserLink(cleanGeneratorState).then(
      () => {
        setLoading(false)
        renderNotification('Url successfully generated. A message has been sent to the user.')
      }
    ).catch(error => {
        setLoading(false)
        let ignoreKeys = Object.keys(GENERATOR_INITIAL_STATE)
        ignoreKeys.push('pay_distribution_data')
        displayErrorNotifications(error, ignoreKeys)
        if (error.response !== undefined) {
          updateErrors(error.response.data)
        }
      }
    )
  }


  return <PaperContainer title="Generator">
    <div>
      <div className="row-div">
        <div className="half-width-div"><h3 className="header">User's full name</h3>
          <TextField
            id="user_full_name"
            name="user_full_name"
            value={user_full_name}
            onChange={updateState}
            onKeyPress={(evt) => onEnterPressed(evt, save)}
            className="textfield-block"
            type="text"
            required
            error={!!generatorErrorState.user_full_name}
            helperText={generatorErrorState.user_full_name}
          /></div>
        <div className="half-width-div">
          <h3 className="header">User's email</h3>
          <TextField
            id="user_email"
            name="user_email"
            value={user_email}
            onChange={updateState}
            onKeyPress={(evt) => onEnterPressed(evt, save)}
            className="textfield-block"
            type="text"
            required
            error={!!generatorErrorState.user_email}
            helperText={generatorErrorState.user_email}
          />
        </div>
      </div>
      <div className="row-div">
        <div className="checkbox-div">
          <FormControlLabel className="switch-box margin-top-30" control={
            <Checkbox
              checked={send_text_message}
              onChange={updateOptionalFieldsState}
              color="primary"
              name="send_text_message"
            />} label="Send text message">
          </FormControlLabel>
          {send_text_message &&
          <SendTextMessageBox user_phone_number={user_phone_number}
                              updateState={updateState}
                              save={save}/>}
        </div>

        <div className="checkbox-div">
          <FormControlLabel className="switch-box margin-top-30" control={
            <Checkbox
              checked={set_integration}
              onChange={updateOptionalFieldsState}
              color="primary"
              name="set_integration"
            />} label="Set integrations">
          </FormControlLabel>
          {set_integration &&
          <SetIntegrationBox updateState={updateStateByKey}/>}
        </div>

        <div className="checkbox-div">
          <FormControlLabel className="switch-box margin-top-30" control={
            <Checkbox
              checked={run_deposit_changed}
              onChange={updateOptionalFieldsState}
              color="primary"
              name="run_deposit_changed"
            />} label="Run direct deposit changed">
          </FormControlLabel>

          {run_deposit_changed &&
          <RunDepositChangedBox
            account_number={account_number}
            routing_number={routing_number}
            allocation_type={allocation_type}
            allocation_value={allocation_value}
            generatorErrorState={generatorErrorState}
            account_type={account_type}
            updateState={updatePayConfigState}
            save={save}/>}
        </div>
      </div>
      <div className="margin-top-30">
        <Button color='primary' variant="contained"
                className="button-centered"
                onClick={() => save()}>{loading ? <CircularProgress size={20}
                                                                    color='inherit'/> : 'Generate URL and send e-mail'}</Button>
      </div>
    </div>
  </PaperContainer>
}
