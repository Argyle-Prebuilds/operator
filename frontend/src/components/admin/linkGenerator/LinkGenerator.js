import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import "../../../styles/index.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import {
  GENERATOR_ACCOUNT_INITIAL_STATE,
  GENERATOR_INITIAL_STATE,
  OPTIONAL_GENERATOR_FIELDS,
} from "../../../consts";
import { generateUserLink } from "../../../services/AdminServices";
import {
  displayErrorNotifications,
  renderNotification,
} from "../../../utils/display-error-notifications";
import { PaperContainer } from "../common/PaperContainer";
import { onEnterPressed } from "../../../utils/general";
import { SendTextMessageBox } from "./SendTextMessageBox";
import { SetIntegrationBox } from "./SetIntegrationBox";
import { RunDepositChangedBox } from "./RunDepositChangedBox";
import CustomCheckbox from "../common/CustomCheckbox";
const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#6563FF",
    boxShadow: "none",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#6563FF",
    },
  },
});

export const LinkGenerator = () => {
  const classes = useStyles();
  const [generatorState, setGeneratorState] = useState(GENERATOR_INITIAL_STATE);
  const [generatorErrorState, setGeneratorErrorState] = useState(
    GENERATOR_INITIAL_STATE
  );
  const [optionalFieldsState, setOptionalFieldsState] = useState(
    OPTIONAL_GENERATOR_FIELDS
  );
  const [loading, setLoading] = useState(false);

  const {
    user_full_name,
    user_email,
    user_phone_number,
    pay_distribution_data,
  } = generatorState;

  const {
    routing_number,
    account_number,
    allocation_type,
    allocation_value,
    account_type,
  } = pay_distribution_data;

  const {
    send_text_message,
    set_integration,
    run_deposit_changed,
  } = optionalFieldsState;

  const updatePayConfigState = (event) => {
    setGeneratorState({
      ...generatorState,
      pay_distribution_data: {
        ...pay_distribution_data,
        [event.target.name]: event.target.value,
      },
    });
    setGeneratorErrorState({
      ...generatorErrorState,
      pay_distribution_data: {
        ...pay_distribution_data,
        [event.target.name]: "",
      },
    });
  };

  const updateState = (event) => {
    setGeneratorState({
      ...generatorState,
      [event.target.name]: event.target.value,
    });
    setGeneratorErrorState({
      ...generatorErrorState,
      [event.target.name]: "",
    });
  };

  const updateStateByKey = (key, value) => {
    setGeneratorState({
      ...generatorState,
      [key]: value,
    });
    setGeneratorErrorState({
      ...generatorErrorState,
      [key]: "",
    });
  };

  const updateErrors = (errors) => {
    let errorList = { ...GENERATOR_INITIAL_STATE };
    for (let key of Object.keys(errors)) {
      errorList[key] = errors[key];
      if (key === "pay_distribution_data") {
        const pay_distribution_data = errorList[key];
        for (let key of Object.keys(pay_distribution_data)) {
          errorList[key] = pay_distribution_data[key];
        }
      }
    }
    setGeneratorErrorState(errorList);
  };

  const updateOptionalFieldsState = (event) => {
    if (event.target.name === "run_deposit_changed" && event.target.checked) {
      setGeneratorState({
        ...generatorState,
        pay_distribution_data: {
          ...pay_distribution_data,
          allocation_type: "amount",
          account_type: "checking",
        },
      });
    }
    if (event.target.name === "run_deposit_changed" && !event.target.checked) {
      setGeneratorState({
        ...generatorState,
        pay_distribution_data: GENERATOR_ACCOUNT_INITIAL_STATE,
      });
    }

    setOptionalFieldsState({
      ...optionalFieldsState,
      [event.target.name]: event.target.checked,
    });
  };

  const save = () => {
    setLoading(true);
    const cleanGeneratorState = { ...generatorState };

    if (!run_deposit_changed) {
      delete cleanGeneratorState["pay_distribution_data"];
    }

    generateUserLink(cleanGeneratorState)
      .then(() => {
        setLoading(false);
        renderNotification(
          "Url successfully generated. A message has been sent to the user."
        );
      })
      .catch((error) => {
        setLoading(false);
        let ignoreKeys = Object.keys(GENERATOR_INITIAL_STATE);
        ignoreKeys.push("pay_distribution_data");
        displayErrorNotifications(error, ignoreKeys);
        if (error.response !== undefined) {
          updateErrors(error.response.data);
        }
      });
  };

  return (
    <PaperContainer title="Generator">
      <div>
        <div className="row-div">
          <div className="half-width-div">
            <TextField
              id="user_full_name"
              name="user_full_name"
              label="User's full name"
              variant="outlined"
              value={user_full_name}
              onChange={updateState}
              onKeyPress={(evt) => onEnterPressed(evt, save)}
              className="textfield-block"
              type="text"
              required
              error={!!generatorErrorState.user_full_name}
              helperText={generatorErrorState.user_full_name}
            />
          </div>
          <div className="half-width-div">
            <TextField
              id="user_email"
              name="user_email"
              label="User's email"
              variant="outlined"
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
        <div className="row-div-start">
          <div className="checkbox-div">
            <CustomCheckbox
              checked={send_text_message}
              onChange={updateOptionalFieldsState}
              name="send_text_message"
              label="Send text message"
            />
          </div>
          <div className="checkbox-div">
            <CustomCheckbox
              checked={set_integration}
              onChange={updateOptionalFieldsState}
              name="set_integration"
              label="Set integrations"
            />
          </div>
          <div className="checkbox-div">
            <CustomCheckbox
              checked={run_deposit_changed}
              onChange={updateOptionalFieldsState}
              name="run_deposit_changed"
              label="Run direct deposit changed"
            />
          </div>
        </div>
        {send_text_message && (
          <SendTextMessageBox
            user_phone_number={user_phone_number}
            updateState={updateState}
            save={save}
          />
        )}
        {set_integration && (
          <SetIntegrationBox updateState={updateStateByKey} />
        )}
        {run_deposit_changed && (
          <RunDepositChangedBox
            account_number={account_number}
            routing_number={routing_number}
            allocation_type={allocation_type}
            allocation_value={allocation_value}
            generatorErrorState={generatorErrorState}
            account_type={account_type}
            updateState={updatePayConfigState}
            save={save}
          />
        )}
        <div className="margin-top-30">
          <Button
            className="homePageSaveButton"
            color="primary"
            variant="contained"
            onClick={() => save()}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Generate URL and send e-mail"
            )}
          </Button>
        </div>
      </div>
    </PaperContainer>
  );
};
