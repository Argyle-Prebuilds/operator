import { useEffect } from "react";
import { validateTokenService } from "../../services/BaseServices";
import "../../styles/index.css";
import {useHistory} from "react-router-dom";
import {LeftNavBar} from "../admin/navbar/LeftNavBar";

export const AuthValidateToken = () => {
    const history = useHistory();

  const validateToken = () => {
    let token = localStorage.getItem("token");
    if (token) {
      validateTokenService({
        token: token
      }).catch((err) => {
        localStorage.removeItem("token");
        history.push("/admin/login");
      });
    } else {
      history.push("/admin/login");
    }
  };

  useEffect(validateToken, []);

  return <LeftNavBar />
};
