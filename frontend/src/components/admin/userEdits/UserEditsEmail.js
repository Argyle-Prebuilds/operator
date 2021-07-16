import React, { useEffect, useState } from "react";

import { Button } from "@material-ui/core";
import "react-dropzone-uploader/dist/styles.css";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "../../../styles/index.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TextField from "@material-ui/core/TextField";
import Dropzone from "react-dropzone-uploader";
import CircularProgress from "@material-ui/core/CircularProgress";
import { USER_EDITS_SETTINGS_INITIAL } from "../../../consts";
import {
  getUserEditsSettings,
  setUserEditsSettings,
} from "../../../services/AdminServices";
import { fetchImage } from "../../../utils/file";
import {
  displayErrorNotifications,
  renderNotification,
} from "../../../utils/display-error-notifications";
import { dropzoneStyles } from "../../../utils/dropzone-styles";
import { onEnterPressed } from "../../../utils/general";
import { ReactComponent as Plus } from "../../../icons/Plus.svg";
import CustomEditor from "../common/CustomEditor";

export const UserEditsEmail = () => {
  const [inputForm, setInputForm] = useState(USER_EDITS_SETTINGS_INITIAL);
  const [files, setFiles] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setLoading(true);
    getUserEditsSettings()
      .then((response) => {
        setInputForm(response.data);
        const { logo, body } = response.data;

        if (logo) {
          fetchImage(logo).then((file) => setFiles([file]));
        }

        const contentBlock = htmlToDraft(body);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const editorState = EditorState.createWithContent(contentState);
          setEditorState(editorState);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        displayErrorNotifications(error);
      });
  };

  const updateState = (name, value) => {
    setInputForm({
      ...inputForm,
      [name]: value,
    });
  };

  const formatData = (data) => {
    let formData = new FormData();
    for (let key of Object.keys(data)) {
      if (key === "logo" && (data[key] == null || data[key] === undefined)) {
        continue;
      }
      formData.append(key, data[key]);
    }

    return formData;
  };

  const saveSettings = () => {
    setLoading(true);
    const formatted_settings = formatData(inputForm);
    setUserEditsSettings(formatted_settings)
      .then((response) => {
        setInputForm(response.data);
        const { logo } = response.data;
        if (logo) {
          fetchImage(logo).then((file) => setFiles([file]));
        }
        renderNotification("Settings successfully saved.");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        displayErrorNotifications(error);
      });
  };

  const updateEditorState = (editorState) => {
    setEditorState(editorState);
    const htmlText = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    updateState("body", htmlText);
  };

  const handleChangeStatus = ({ meta, file }, status) => {
    updateState("logo", file);
    if (status === "removed") {
      updateState("logo", null);
    }
  };

  const handleChange = (evt) => {
    setInputForm({
      ...inputForm,
      [evt.target.id]: evt.target.value,
    });
  };

  return (
    <div>
      <TextField
        id="subject"
        variant="outlined"
        label="Subject"
        value={inputForm.subject}
        onChange={handleChange}
        onKeyPress={(evt) => onEnterPressed(evt, saveSettings)}
        className="huge-input textfield-block"
        type="text"
      />
      <h3 className="header">Add logo</h3>
      <Dropzone
        styles={dropzoneStyles}
        inputContent={<Plus />}
        maxFiles={1}
        onChangeStatus={handleChangeStatus}
        accept=".jpg,.jpeg,.png"
        multiple={false}
        initialFiles={files}
      />
      <TextField
        id="header"
        variant="outlined"
        label="Header"
        value={inputForm.header}
        onChange={handleChange}
        onKeyPress={(evt) => onEnterPressed(evt, saveSettings)}
        className="huge-input textfield-block"
        type="text"
      />
      <h3 className="header margin-top-30">Body</h3>
      <CustomEditor
        editorState={editorState}
        placeholder="Body..."
        onEditorStateChange={(editorState) => updateEditorState(editorState)}
      />
      <div
        className="big-input"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          id="button_text"
          variant="outlined"
          label="Button text"
          value={inputForm.button_text}
          onChange={handleChange}
          onKeyPress={(evt) => onEnterPressed(evt, saveSettings)}
          className="huge-input textfield-block margin-top-25"
          type="text"
        />
        <Button
          color="primary"
          variant="contained"
          className="small-input homePageSaveButton margin-top-25 spinner-container"
          onClick={() => saveSettings()}
        >
          {loading ? <CircularProgress size={30} color="inherit" /> : "Save"}
        </Button>
      </div>
    </div>
  );
};
