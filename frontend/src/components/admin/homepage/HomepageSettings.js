import React, {useEffect, useState} from "react";
import {HOMEPAGE_SETTINGS_INITIAL} from "../../../consts";
import {
  setHomepageSettings
} from "../../../services/AdminServices";
import {
  getHomepageSettings
} from "../../../services/BaseServices";
import {Button} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "../../../styles/index.css";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {PaperContainer} from "../common/PaperContainer";
import {fetchImage} from "../../../utils/file";
import {dropzoneStyles} from "../../../utils/dropzone-styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  displayErrorNotifications,
  renderNotification
} from "../../../utils/display-error-notifications"
import TextField from "@material-ui/core/TextField";
import {onEnterPressed} from "../../../utils/general"


export const HomepageSettings = () => {
  const [settings, setSettings] = useState(HOMEPAGE_SETTINGS_INITIAL)
  const [files, setFiles] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadHomepageSettings()
  }, [])

  const loadHomepageSettings = () => {
    setLoading(true)

    getHomepageSettings().then((response) => {
      setSettings({...HOMEPAGE_SETTINGS_INITIAL, ...response.data})

      const {logo, html_text} = response.data
      if (logo) {
        fetchImage(logo).then(file => setFiles([file]))
      }

      const contentBlock = htmlToDraft(html_text);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState)
      }

      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      displayErrorNotifications(error)
    })
  }

  const updateState = (name, value) => {
    setSettings({
      ...settings,
      [name]: value
    })
  };

  const formatData = (data) => {
    let formData = new FormData();
    formData.append('html_text', data.html_text);
    formData.append('show_button', data.show_button);
    formData.append('button_text', data.button_text);

    if (data.logo !== null) {
      formData.append('logo', data.logo);
    }

    return formData;
  };

  const saveSettings = () => {
    const formatted_settings = formatData(settings)
    setLoading(true)

    setHomepageSettings(formatted_settings).then(response => {
      const {logo} = response.data

      setSettings(response.data)

      if (logo) {
        fetchImage(logo).then(file => setFiles([file]))
      }

      renderNotification('Homepage data successfully saved.')
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      displayErrorNotifications(error)
    })
  }

  const handleChangeStatus = ({meta, file}, status) => {
    updateState('logo', file)

    if (status === 'removed') {
      updateState('logo', null)
    }
  }

  const updateEditorState = (editorState) => {
    setEditorState(editorState);
    const htmlText = draftToHtml(convertToRaw(editorState.getCurrentContent()))

    updateState('html_text', htmlText)
  }

  return (
    <PaperContainer title="Homepage Editor">
      <div>
        <h3 className="header">Logo</h3>
        <Dropzone styles={dropzoneStyles}
                  inputContent="Drag File or Click to Add Logo" maxFiles={1}
                  onChangeStatus={handleChangeStatus}
                  accept=".jpg,.jpeg,.png"
                  multiple={false}
                  initialFiles={files}
        />
        <h3 className="header margin-top-30">Homepage Text</h3>

        <div className="editor-box">
          <Editor
            editorState={editorState}
            placeholder={"Write homepage welcome text..."}
            onEditorStateChange={(editorState) => updateEditorState(editorState)}
            toolbar={{
              options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'colorPicker'],
            }}/>
        </div>
        <FormControlLabel className="switch-box margin-top-30" control={
          <Switch
            checked={settings.show_button}
            onChange={(e) => updateState('show_button', e.target.checked)}
            color="primary"
            name="show_button"
          />} label="Show Argyle button" labelPlacement="start">
        </FormControlLabel>
        {settings.show_button &&
        <div className={"margin-bottom-25"}><h3 className="header">Button
          Text</h3>
          <TextField
            id="button_text"
            name="button_text"
            value={settings.button_text}
            onChange={(e) => updateState('button_text', e.target.value)}
            onKeyPress={(e) => onEnterPressed(e, saveSettings)}
            className="textfield-block"
            type="text"
          />
        </div>
        }
        <Button color='primary' variant="contained"
                className="button-centered spinner-container"
                onClick={saveSettings}>
          {loading ? <CircularProgress size={30} color='inherit'/> : "Save"}
        </Button>
      </div>
    </PaperContainer>
  )
}
