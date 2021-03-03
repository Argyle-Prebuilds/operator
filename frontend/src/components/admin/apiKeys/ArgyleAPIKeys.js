import {Button} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {addAPIKey, getAPIKeys} from "../../../services/AdminServices";
import {displayErrorNotifications, renderNotification} from "../../../utils/display-error-notifications";
import {PaperContainer} from "../common/PaperContainer";
import {onEnterPressed} from "../../../utils/general";


const INITIAL_FORM_STATE = {
  client_id: '',
  client_secret: '',
  plugin_key: '',
  is_sandbox_mode: false
}

export const ArgyleAPIKeys = () => {

  const [inputForm, setInputForm] = useState(INITIAL_FORM_STATE)
  const [errorState, setErrorState] = useState(INITIAL_FORM_STATE)
  const [loading, setLoading] = useState(false)

  const updateFormState = (event) => {
    setInputForm({
      ...inputForm,
      [event.target.name]: event.target.type === 'checkbox'? event.target.checked  : event.target.value,
    });
    setErrorState({
      ...errorState,
      [event.target.name]: ''
    })
  }

  const updateErrors = (errors) => {
    let errorList = {...INITIAL_FORM_STATE};
    for (let key of Object.keys(errors)) {
      errorList[key] = errors[key];
    }
    setErrorState(errorList);
  }

  const getKeys = () => {
    getAPIKeys().then((response) => {
      setInputForm(response.data)
    }).catch((error) => {
      displayErrorNotifications(error)
    })
  }

  useEffect(getKeys, [])
  const saveChanges = () => {
    setLoading(true)

    addAPIKey(inputForm).then(response => {
      renderNotification('Keys successfully saved.')
      setLoading(false)
    }).catch(error => {
        setLoading(false)
        let ignoreKeys = Object.keys(INITIAL_FORM_STATE)
        ignoreKeys.push('pay_distribution_data')
        displayErrorNotifications(error, ignoreKeys)
        if (error.response !== undefined) {
          updateErrors(error.response.data)
        }
      }
    )
  }

  const {client_id, client_secret, plugin_key, is_sandbox_mode} = inputForm

  return <PaperContainer title="Api Keys">
    <div className="paper-child-container">
      <h3 className="header">plugin_key</h3>
      <TextField
        value={plugin_key}
        name='plugin_key'
        onChange={updateFormState}
        onKeyPress={(evt) => onEnterPressed(evt, saveChanges)}
        required
        error={!!errorState.plugin_key}
        helperText={errorState.plugin_key}
      />
      <h3 className="header">client_id</h3>

      <TextField
        value={client_id}
        name='client_id'
        onChange={updateFormState}
        onKeyPress={(evt) => onEnterPressed(evt, saveChanges)}
        required
        error={!!errorState.client_id}
        helperText={errorState.client_id}
      />
      <h3 className="header">client_secret</h3>
      <TextField
        value={client_secret}
        name='client_secret'
        onChange={updateFormState}
        onKeyPress={(evt) => onEnterPressed(evt, saveChanges)}
        required
        error={!!errorState.client_secret}
        helperText={errorState.client_secret}
      />

      <FormControlLabel className="switch-box margin-top-30" control={
        <Switch
          checked={is_sandbox_mode}
          onChange={(event) => updateFormState(event)}
          color="primary"
          name="is_sandbox_mode"
        />} label="Is sandbox mode?" labelPlacement="start">
      </FormControlLabel>

      <div className="add-key-pair-btn">
        <Button onClick={saveChanges} color='primary' variant="contained">
          {loading ?
            <CircularProgress size={30} color='inherit'/> : "Save keys"}
        </Button>
      </div>
    </div>
  </PaperContainer>
}
