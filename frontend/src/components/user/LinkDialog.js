import {useEffect} from "react";
import useImportScript from "../../hooks/useImportScript";
import {generateNewUserToken, updateUserLinkData} from "../../services/BaseServices";
import {displayErrorNotifications} from "../../utils/display-error-notifications";

//it's displayed on
// 1) homepage (we don't have userLink data and don't save argyle uuid & token)
// 2) by user link (we keep token and argyle user uuid to display correct user account)
export const LinkDialog = (props) => {
    const {
        user_id, open, handleClose, pluginKey, apiHost, userLinkData, payDistributionConfig,
        onChange = () => {
        },
        handleArgyleInformation = (argyleUUID, argyleToken) => {
        }
    } = props;
    const loaded = useImportScript("https://plugin.argyle.io/argyle.web.v1.js");
    let argyle = null;
    const dataPartners = userLinkData && userLinkData.data_partner_id ? [userLinkData.data_partner_id] : []
    const token = userLinkData && userLinkData.argyle_token ? userLinkData.argyle_token : ''

    const sendArgyleFields = (argyleUserId, argyleUserToken) => {
        // If we dont have user_id we don't save token and argyle uuid
        if (!user_id) return;

        const data = {
            argyle_uuid: argyleUserId,
            argyle_token: argyleUserToken
        }

        updateUserLinkData(user_id, data).then(() => {
            handleArgyleInformation(argyleUserId, argyleUserToken)
        }).catch(error =>
            displayErrorNotifications(error)
        )
    }

    const sendArgyleAccountInfo = (accountId, userId) => {
        // If we dont have user_id we don't save token and argyle uuid
        if (!user_id) return;

        const data = {
            argyle_uuid: userId,
            argyle_account_id: accountId
        }

        updateUserLinkData(user_id, data).then(() => {
            handleArgyleInformation(userId, token)
        }).catch(error =>
            displayErrorNotifications(error)
        )
    }

    const createArgyle = () => {
        argyle = window.Argyle.create({
            pluginKey: pluginKey,
            apiHost: apiHost,
            userToken: token,
            payDistributionItemsOnly: !!payDistributionConfig,
            payDistributionConfig: payDistributionConfig,
            dataPartners: dataPartners,
            onAccountCreated: onChange,
            onAccountConnected: ({accountId, userId}) => {
                sendArgyleAccountInfo(accountId, userId)
            },
            onAccountUpdated: onChange,
            onAccountRemoved: onChange,
            onUserCreated: ({userId, userToken}) => {
                sendArgyleFields(userId, userToken)
            },
            onClose: handleClose,
            onTokenExpired: updateToken => {
                generateNewUserToken(user_id).then(response => {
                    const newToken = response.data.token
                    updateToken(newToken)
                    handleArgyleInformation(userLinkData.argyle_uuid, newToken)
                }).catch(error => displayErrorNotifications(error))
            }
        })
        argyle.open()
    }

    useEffect(() => {

        if (!loaded || !open) return
        createArgyle()
    }, [loaded, open])

    return <>
    </>
}

