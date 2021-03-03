import React, {useEffect, useState} from "react";
import {
  fetchAdminUsersService,
  removeAdminUserService,
  addAdminUserService,
} from "../../../services/AdminServices";
import "../../../styles/index.css";
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import {TableCell} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  displayErrorNotifications,
  renderNotification
} from "../../../utils/display-error-notifications"
import {AddUserDialog} from "./AddUserDialog";
import {ConfirmDialog} from "../common/ConfirmDialog";
import {PaperContainer} from "../common/PaperContainer";

export const AdminUserList = () => {
  const INITIAL_STATE = {
    email: "",
  };
  const [userList, setUserList] = useState([]);
  const [inputFormErrors, setInputFormErrors] = useState(INITIAL_STATE);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false)

  const logged_in_user_id = localStorage.getItem('user_id')

  const fetchUsers = () => {
    fetchAdminUsersService()
      .then((response) => {
        setUserList(response.data);
      })
      .catch((error) => {
        displayErrorNotifications(error)
      })
  };

  const removeUser = (confirmed) => {
    setConfirmationOpen(false);
    if (confirmed) {
      setLoading(true)
      removeAdminUserService(selectedUser.id)
        .then((response) => {
          renderNotification('User removed.')
          fetchUsers();
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          displayErrorNotifications(error)
        });
    }
  };

  const addUser = (email) => {
    setAddUserOpen(false);
    setInputFormErrors(INITIAL_STATE);
    if (email) {
      setLoading(true)
      addAdminUserService({
        email: email,
      })
        .then((response) => {
          setLoading(false)
          renderNotification('User successfully added.')
          fetchUsers();
        })
        .catch((error) => {
          setLoading(false)
          setAddUserOpen(true)
          displayErrorNotifications(error, Object.keys(INITIAL_STATE))
          if (error.response !== undefined) {
            setInputFormErrors(error.response.data)
          }
        });
    }
  };

  const generateTable = () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className="table-head">Email</TableCell>
          <TableCell className="table-head">Status</TableCell>
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userList.map((elem) => {
          return (
            <TableRow key={elem.email}>
              <TableCell>{elem.email}</TableCell>
              {elem.is_active ?
                <TableCell className="text-green">Active</TableCell>
                : <TableCell className="text-greyed">Inactive</TableCell>
              }

              <TableCell align="right" className="actions-cell">
                {logged_in_user_id !== elem.id &&
                <div className={"action-buttons"}>
                  <Button
                    variant="text"
                    className="button-min-width"
                    onClick={() => {
                      setConfirmationOpen(true);
                      setSelectedUser(elem);
                    }}
                  >
                    <DeleteIcon/>
                  </Button>
                </div>
                }
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  )

  useEffect(fetchUsers, []);

  return (
    <PaperContainer title="Admin List">
      <div>
        <div>
          {!userList.length && (
            <Typography variant="h6" align="center"
                        className="margin-bottom-25">
              Empty list
            </Typography>
          )}
          {userList && generateTable()}
        </div>
        <Button
          className="button-centered margin-top-25 button-min-width spinner-container"
          variant="contained"
          color="primary"
          onClick={() => {
            setAddUserOpen(true);
          }}
        >
          {loading ? <CircularProgress size={30}
                                       color="inherit"/> : "Add a new Admin user"}
        </Button>
        <ConfirmDialog
          open={confirmationOpen}
          onClose={removeUser}
          title="Are you sure you want to delete this account?"
        />
        <AddUserDialog
          open={addUserOpen}
          onClose={addUser}
          errors={inputFormErrors}
          title="Add a new admin user"
        />
      </div>
    </PaperContainer>
  );
}
