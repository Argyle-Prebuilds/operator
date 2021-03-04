import React, {useState} from "react";

import {
    Box,
    Container,
    Card,
    TextField,
    Button,
} from "@material-ui/core";
import SettingsBackupRestoreIcon
    from '@material-ui/icons/SettingsBackupRestore';
import CircularProgress from '@material-ui/core/CircularProgress';
import {passwordResetService} from "../../services/BaseServices";
import "../../styles/index.css";
import {PASSWORD_RESET_INITIAL_STATE} from "../../consts";
import {
    displayErrorNotifications,
    renderNotification
} from "../../utils/display-error-notifications"
import {onEnterPressed} from "../../utils/general"

export const PasswordReset = () => {

    const [formData, setFormData] = useState(PASSWORD_RESET_INITIAL_STATE);
    const [formErrors, setFormErrors] = useState(PASSWORD_RESET_INITIAL_STATE);
    const [loading, setLoading] = useState(false)

    const handleChange = (evt) => {
        setFormErrors({...formErrors, [evt.target.name]: ""});
        setFormData({...formData, [evt.target.name]: evt.target.value});
    };

    const handleSubmit = () => {
        setLoading(true)
        passwordResetService(formData)
            .then(() => {
                setLoading(false)
                renderNotification('Check your email for a message from us.')
            })
            .catch((error) => {
                setLoading(false)
                displayErrorNotifications(error, Object.keys(PASSWORD_RESET_INITIAL_STATE))
                if (error.response !== undefined) {
                    setFormErrors(error.response.data)
                }
            });
    };

    return (
        <Box>
            <Container>
                <Card variant="outlined" className="card-auth margin-top-25">
                    <SettingsBackupRestoreIcon className="login-icon"/>
                    <h3 className="margin-top-25" align="center">
                        Password Reset
                    </h3>
                    <div className="input-container">
                        <TextField
                            label="Email"
                            name="email"
                            variant="standard"
                            margin="normal"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={handleChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            onKeyPress={(evt) => onEnterPressed(evt, handleSubmit)}
                        />
                    </div>
                    <div className="input-container margin-top-25">
                        <Button
                            variant="contained"
                            color="primary"
                            className="button-auth spinner-container"
                            type="submit"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            {loading ? <CircularProgress size={30}
                                                         color='inherit'/> : "Reset Password"}
                        </Button>
                    </div>
                </Card>
            </Container>
        </Box>
    );
};
