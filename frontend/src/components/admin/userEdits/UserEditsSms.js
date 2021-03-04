import React, {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import 'react-dropzone-uploader/dist/styles.css'
import "../../../styles/index.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import TextField from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import {getUserEditsSettings, setUserEditsSettings} from "../../../services/AdminServices";
import {displayErrorNotifications, renderNotification} from "../../../utils/display-error-notifications";
import {SMS_INVITATION_LINK_CODE} from "../../../consts";

export const UserEditsSms = () => {

    const [smsMessage, setSmsMessage] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = () => {
        setLoading(true)
        getUserEditsSettings().then((response) => {
            if (response.data.sms_message) {
                setSmsMessage(response.data.sms_message)
            }
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            displayErrorNotifications(error)
        })
    }

    const formatData = () => {
        let formData = new FormData();
        formData.append('sms_message', smsMessage)
        return formData
    }
    const saveSettings = () => {
        setLoading(true)
        setUserEditsSettings(formatData()).then(response => {
            setSmsMessage(response.data.sms_message)
            renderNotification('Settings successfully saved.')
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            displayErrorNotifications(error)
        })
    }

    const handleChange = (evt) => {
        setSmsMessage(evt.target.value);
    }

    return (
        <div>
            <h3 className="header">Message</h3>
            <div className="flex-container">
                <TextField
                    id="subject"
                    value={smsMessage}
                    onChange={handleChange}
                    className="textfield-block"
                    type="text"
                    multiline={true}
                    rowsMax={12}
                />
                <Button variant="contained" className="insert-link-btn"
                        onClick={(e) => setSmsMessage(smsMessage + SMS_INVITATION_LINK_CODE)}>Insert Link</Button>
            </div>

            <Button color='primary' variant="contained"
                    className="button-centered margin-top-25 spinner-container"
                    onClick={() => saveSettings()}>
                {loading ?
                    <CircularProgress size={30} color='inherit'/> : "Save"}
            </Button>
        </div>
    )
}
