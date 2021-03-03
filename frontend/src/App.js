import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect
} from "react-router-dom";
import Container from "@material-ui/core/Container";
import {Login} from "./components/auth/Login";
import {AuthValidateToken} from "./components/auth/AuthValidateToken"
import NotFoundPage from "./components/NotFoundPage";
import {PasswordReset} from "./components/auth/PasswordReset";
import {PasswordUpdate} from "./components/auth/PasswordUpdate";
import {AdminUserList} from "./components/admin/adminList/AdminUserList";
import {AccountActivate} from "./components/auth/AccountActivate";
import {ArgyleAPIKeys} from "./components/admin/apiKeys/ArgyleAPIKeys";


const AdminRouteComponent = ({path, children, auth}) => {
    return <Route path={path}>
        {auth && <AuthValidateToken/>}
        <Container className="index-container">
            <div className="full-width-div">
                {children}
            </div>
        </Container>
    </Route>
}


export default function App() {
    return (
        <Router>
            <Switch>
                <AdminRouteComponent path="/admin/login/">
                    <Login/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/password-reset/">
                    <PasswordReset/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/password-update/:user_id/">
                    <PasswordUpdate/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/activate/:user_id">
                    <AccountActivate/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/accounts/" auth={true}>
                    <AdminUserList/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/api-keys/" auth={true}>
                    <ArgyleAPIKeys/>
                </AdminRouteComponent>



                <AdminRouteComponent path="/admin/" auth={true}>
                    <Redirect to="/admin/accounts/"/>
                </AdminRouteComponent>

                <Route>
                    <NotFoundPage/>
                </Route>
            </Switch>
        </Router>
    );
}
