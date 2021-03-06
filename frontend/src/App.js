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
import {HomepageSettings} from "./components/admin/homepage/HomepageSettings";
import {UserEditsTabs} from "./components/admin/userEdits/UserEditsTabs";
import {LinkGenerator} from "./components/admin/linkGenerator/LinkGenerator";
import {Homepage} from "./components/user/Homepage";
import {UserList} from "./components/admin/userList/UserList";
import {DistributionDetails} from "./components/admin/userList/DistributionDetails";


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

const UserRouteComponent = ({path, children, exact}) => {
    return <Route path={path} exact={exact}>
        {children}
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
                <AdminRouteComponent path="/admin/homepage/" auth={true}>
                    <HomepageSettings/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/user-edits/" auth={true}>
                    <UserEditsTabs/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/generator" auth={true}>
                    <LinkGenerator/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/user-list/distribution-detail/:uuid/" auth={true}>
                    <DistributionDetails/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/user-list" auth={true}>
                    <UserList/>
                </AdminRouteComponent>
                <AdminRouteComponent path="/admin/" auth={true}>
                    <Redirect to="/admin/accounts/"/>
                </AdminRouteComponent>
                {/*Link generated by generator link*/}
                <UserRouteComponent path="/user/:user_id">
                    <Homepage/>
                </UserRouteComponent>
                {/*Direct access to homepage*/}
                <UserRouteComponent path="/" exact={true} >
                    <Homepage/>
                </UserRouteComponent>
                <Route>
                    <NotFoundPage/>
                </Route>
            </Switch>
        </Router>
    );
}
