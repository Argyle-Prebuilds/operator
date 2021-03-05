import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import {useHistory, useParams} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Container } from "@material-ui/core";
import {getArgylePluginKey, getHomepageSettings, getUserLinkData} from "../../services/BaseServices";
import {LinkDialog} from "./LinkDialog";

export const Homepage = () => {
  const user_id = useParams().user_id
  const history = useHistory();
  const [settings, setSettings] = useState({})
  const [open, setOpen] = useState(false)
  const [pluginKey, setPluginKey] = useState("")
  const [apiHost, setApiHost] = useState("")
  const [userLinkData, setUserLinkData] = useState({})
  const [payDistributionConfig, setPayDistributionConfig] = useState("")
  const [loading, setLoading] = useState(true)

  const loadHomepageSettings = () => {
    getHomepageSettings().then((response) => {
      setSettings(response.data)
      loadPluginKey()
    }).catch()
  }

  const loadPluginKey = () => {
    getArgylePluginKey().then(response => {
      setPluginKey(response.data.plugin);
      setApiHost(response.data.host);
      if (user_id) {
        loadUserInformation()
      } else {
        setLoading(false)
      }
    }).catch()
  }

  const loadUserInformation = () => {
    if (!user_id) return;

    getUserLinkData(user_id).then(response => {
      const {details, accounts} = response.data
      setUserLinkData(details)
      setOpen(accounts.length <= 0)
      //  Extract payDistributionConfig
      if ('encrypted_config' in details) {
        setPayDistributionConfig(details['encrypted_config'])
      }
      setLoading(false)
    }).catch(error => {
      // It means user with this uuid does not exist
      if (error.response.status === 404) {
        history.push('/')
      }
      setLoading(false);
    })
  }

  useEffect(loadHomepageSettings, [])

  const handleArgyleInformation = (argyleUUID, argyleToken) => {
    setUserLinkData({
      ...userLinkData,
      argyle_uuid: argyleUUID,
      argyle_token: argyleToken
    })
  }

  const displayLinkDialog = () => {

    if (user_id) {
      return <LinkDialog open={open} handleClose={() => setOpen(false)}
                         pluginKey={pluginKey}
                         apiHost={apiHost}
                         handleArgyleInformation={handleArgyleInformation}
                         userLinkData={userLinkData}
                         payDistributionConfig={payDistributionConfig}
                         onChange={loadUserInformation}
                         user_id={user_id}/>
    }

    return <LinkDialog open={open} handleClose={() => setOpen(false)}
                       pluginKey={pluginKey}/>
  }

  const {logo, html_text, show_button, button_text} = settings;


  if (loading) {
    return <div className={'homepage-container'}>
      <div className={'homepage-body'}>
        <CircularProgress/>
      </div>
    </div>
  }

  return <div className={'homepage-container'}>
    <img className={'homepage-icon'} src={logo}/>
    <div className={'homepage-body'}>
      <Container>
        <div dangerouslySetInnerHTML={{__html: html_text}}>
        </div>
        {show_button && <Button color="primary" variant="contained"
                                onClick={() => setOpen(true)}
                                style={{alignSelf: "inline"}}>{button_text || "Connect"}</Button>}
        {displayLinkDialog()}
      </Container>
    </div>
  </div>
}
