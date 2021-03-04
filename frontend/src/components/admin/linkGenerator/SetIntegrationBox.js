import React, {useEffect, useState, useRef} from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {throttle} from "lodash";
import {getDataPartners} from "../../../services/AdminServices";
import {displayErrorNotifications} from "../../../utils/display-error-notifications";


export const SetIntegrationBox = (props) => {
  const {updateState} = props
  const [partners, setPartners] = useState([])
  const [integrationError, setIntegrationError] = useState(true)

  const getPaginatedDataPartners = (value) => {
    const params = {search: value}
    getDataPartners(params).then(response => {
      setPartners(response.data)
      setIntegrationError(false)
    }).catch(error => {
      setIntegrationError(true)
      displayErrorNotifications(error)
    })
  }

  useEffect(() => {
    getPaginatedDataPartners("")
  }, [])

  const searching = useRef(throttle(getPaginatedDataPartners, 3000));

  return <>
    {integrationError ? null : <div className="extra-info-div">
      <h3 className="header" id="data_partner_label">Data partner</h3>
      <Autocomplete
        style={{paddingRight: '25px'}}
        name="data_partner_id"
        onChange={(event, newValue) => {
          if(newValue){
            updateState('data_partner_id', newValue.id)
          }
        }}
        onInputChange={(event, newInputValue) => {
          searching.current(newInputValue);
        }}
        options={partners}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="" value={params.id}
        />}
      />
    </div>}
  </>
}
