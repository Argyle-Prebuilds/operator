import React, {useState} from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CircularProgress from '@material-ui/core/CircularProgress';
import {loginService} from "../../services/BaseServices";
import "../../styles/index.css";
import {useHistory} from "react-router-dom";
import {LOGIN_INITIAL_STATE} from "../../consts";
import {displayErrorNotifications} from "../../utils/display-error-notifications"
import {onEnterPressed} from "../../utils/general"

export const Login = () => {
  const history = useHistory();
  const [formData, setFormData] = useState(LOGIN_INITIAL_STATE);
  const [formErrors, setFormErrors] = useState(LOGIN_INITIAL_STATE);
  const [loading, setLoading] = useState(false)

  const handleChange = (evt) => {
    setFormErrors({...formErrors, [evt.target.name]: ""});
    setFormData({...formData, [evt.target.name]: evt.target.value});
  };

  const handleSubmit = () => {
    setLoading(true)
    setFormErrors(LOGIN_INITIAL_STATE);
    loginService(formData)
      .then((response) => {
        setLoading(false)
        localStorage.setItem("token", response.data["token"]);
        localStorage.setItem("user_id", response.data["user_id"]);
        history.push("/admin/accounts");
      })
      .catch((error) => {
        setLoading(false)
        displayErrorNotifications(error, Object.keys(LOGIN_INITIAL_STATE))
        if (error.response !== undefined) {
          setFormErrors(error.response.data)
        }
      });
  };

  return (
    <Box>
      <Container>
        <Card className="card-auth margin-top-25">
          <LockOpenIcon className="login-icon"/>
          <Typography className="margin-top-25" variant="h5" align="center">
            Sign in
          </Typography>
          <div className="input-container">
            <TextField
              label="Email"
              name="email"
              variant="standard"
              margin="normal"
              type="email"
              required
              fullWidth
              value={formData.email}
              onChange={handleChange}
              onKeyPress={(evt) => onEnterPressed(evt, handleSubmit)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              autoFocus
            />
          </div>
          <div className="input-container">
            <TextField
              label="Password"
              name="password"
              variant="standard"
              margin="normal"
              type="password"
              required
              fullWidth
              value={formData.password}
              onChange={handleChange}
              onKeyPress={(evt) => onEnterPressed(evt, handleSubmit)}
              error={!!formErrors.password}
              helperText={formErrors.password}
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
              {loading ?
                <CircularProgress size={30} color='inherit'/> : "Sign in"}
            </Button>
          </div>
          <div className="margin-top-25">
            <a
              className="link-disable-visited link-color"
              href="/admin/password-reset"
            >
              Forgot password?
            </a>
          </div>
        </Card>
      </Container>
    </Box>
  );
};
