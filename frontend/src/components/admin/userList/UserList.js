import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {IconButton, TableCell, Chip} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import SmsIcon from '@material-ui/icons/Sms';
import EmailIcon from '@material-ui/icons/Email';
import DeleteIcon from '@material-ui/icons/Delete';
import {useHistory} from "react-router-dom";
import {displayErrorNotifications, renderNotification} from "../../../utils/display-error-notifications";
import {CustomTooltip} from "./CustomTooltip";
import {PaperContainer} from "../common/PaperContainer";
import {ConfirmDialog} from "../common/ConfirmDialog";
import {
  deleteUserLinkService,
  getUserLinks,
  resendUserLinkEmail,
  resendUserLinkSMS
} from "../../../services/AdminServices";
import {LinkedAccountStatus, LinkedPayAllocationStatus} from "../../../consts";

export const UserList = () => {
  const [userList, setUserList] = useState([])
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedUserLink, setSelectedUserLink] = useState('');
  const history = useHistory()

  const loadUserList = () => {
    getUserLinks().then(response => {
      setUserList(response.data)
    }).catch(error => displayErrorNotifications(error))
  }

  const resendEmail = (userUUID) => {
    resendUserLinkEmail(userUUID).then(() => {
      renderNotification('Email successfully resent.')
    }).catch(error => displayErrorNotifications(error))
  }

  const resendSMS = (userUUID) => {
    resendUserLinkSMS(userUUID).then(() => {
      renderNotification('SMS successfully resent.')
    }).catch(error => displayErrorNotifications(error))
  }

  const deleteUserLink = (confirmed) => {
    if (confirmed) {
      deleteUserLinkService(selectedUserLink).then(() => {
        renderNotification('Userlink deleted successfully.')
        loadUserList()
      }).catch(error => displayErrorNotifications(error))
    }
    setConfirmationOpen(false)
  }

  const payAllocationDetails = (uuid) => {
    history.push(`/admin/user-list/distribution-detail/${uuid}`)
  }

  useEffect(loadUserList, [])

  const generateTable = () => {
    if (userList.length === 0) {
      return <p>No user links</p>
    }

    return <Table>
      <TableHead>
        <TableRow>
          <TableCell className="table-head">Email</TableCell>
          <TableCell className="table-head">Linked Accounts</TableCell>
          <TableCell className="table-head">Pay Allocations statuses</TableCell>
          <TableCell className="table-head">Pay Allocations</TableCell>
          <TableCell className="table-head">Link</TableCell>
          <TableCell className="table-head" >Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userList.map((element) => {
          return (
            <TableRow key={element.uuid}>
              <TableCell
              >
                {element.user_email}
              </TableCell>
              <TableCell
              >
                Connected: {element.linked_accounts.filter(item => item.status === LinkedAccountStatus.CONNECTED).length}
                <br/>
                Failed: {element.linked_accounts.filter(item => item.status === LinkedAccountStatus.FAILED).length}
              </TableCell>
              <TableCell>
                  Added: {element.linked_pay_allocations.filter(item => item.status === LinkedPayAllocationStatus.ADDED).length}
                <br/>
                Updated: {element.linked_pay_allocations.filter(item => item.status === LinkedPayAllocationStatus.UPDATED).length}
                <br/>

                Removed: {element.linked_pay_allocations.filter(item => item.status === LinkedPayAllocationStatus.REMOVED).length}
                <br/>
              </TableCell>
              <TableCell
              >
                <CustomTooltip title="Details" placement="bottom">
                  <Chip
                    label={element.linked_pay_allocations.length}
                    onClick={() => payAllocationDetails(element.uuid)}
                  />
                </CustomTooltip>
              </TableCell>
              <TableCell
              ><Link to={`/user/${element.uuid}`}>User Link</Link>
              </TableCell>
              <TableCell>
                <div className={"action-buttons"}>
                  <CustomTooltip title="Resend Email" placement="bottom">
                    <IconButton
                      variant="text"
                      onClick={() => resendEmail(element.uuid)}
                    >
                      <EmailIcon/>
                    </IconButton>
                  </CustomTooltip>
                  <CustomTooltip title="Resend SMS" placement="bottom"
                                 disabled={!element.user_phone_number}>
                    <IconButton
                      variant="text"
                      disabled={!element.user_phone_number}
                      onClick={() => resendSMS(element.uuid)}
                    >
                      <SmsIcon/>
                    </IconButton>
                  </CustomTooltip>
                  <CustomTooltip title="Remove user" placement="bottom">
                    <IconButton
                      variant="text"
                      className="button-min-width"
                      onClick={() => {
                        setConfirmationOpen(true);
                        setSelectedUserLink(element.uuid);
                      }}
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </CustomTooltip>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  }

  return (
    <PaperContainer title="User Link List">
      <div className="negative-margin-top">
        {generateTable()}
      </div>
      <ConfirmDialog
        open={confirmationOpen}
        onClose={deleteUserLink}
        title="Are you sure you want to delete this account?"
      />
    </PaperContainer>
  )
}
