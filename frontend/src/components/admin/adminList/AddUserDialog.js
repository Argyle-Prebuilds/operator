import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import {TextField} from "@material-ui/core";
import "../../../styles/index.css";
import {onEnterPressed} from "../../../utils/general"


export const AddUserDialog = (props) => {
    const {onClose, open, title, errors} = props;
    const [email, setEmail] = useState("");

    const handleClose = (confirmed = false) => {
        if (confirmed) {
            onClose(email);
        } else {
            onClose("");
        }
        setEmail("");
    };

    const handleChange = (evt) => {
        setEmail(evt.target.value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <Paper className="dialog">
                <DialogTitle>{title}</DialogTitle>
                <div className="margin-bottom-25">
                    <TextField
                        id="email"
                        label="Email"
                        value={email}
                        error={!!errors.email}
                        helperText={errors.email}
                        onChange={handleChange}
                        onKeyPress={(evt) => onEnterPressed(evt, () => {
                            handleClose(true)
                        })}
                        className="textfield-block"
                    />
                </div>
                <div className="buttons-container">
                    <Button
                        variant="contained"
                        color="primary"
                        className="button-min-width"
                        disabled={!email}
                        onClick={() => handleClose(true)}
                    >
                        Add
                    </Button>
                    <Button
                        variant="contained"
                        className="button-min-width"
                        onClick={() => handleClose(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </Paper>
        </Dialog>
    );
}
