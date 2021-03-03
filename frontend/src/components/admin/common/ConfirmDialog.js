import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import "../../../styles/index.css";


export const ConfirmDialog = (props) => {
  const {onClose, open, title} = props;

  const handleClose = (confirmed) => {
    if (confirmed) {
      onClose(true);
    } else {
      onClose(false);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Paper className="dialog">
        <DialogTitle>{title}</DialogTitle>
        <div className="buttons-container">
          <Button
            variant="contained"
            color="primary"
            className="button-min-width"
            onClick={() => handleClose(true)}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            color="default"
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
