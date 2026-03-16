import { Link } from "@tanstack/react-router";
import type {LoggedInProps} from "../types";
import { userStore } from "../userStore";


export default function LoginButton(){
    const loggedIn = userStore ((state) => state.loginState);
    const loggedInUser = userStore ((state) => state.userName);
    
    return<div>
        {!loggedIn ? <Link to="/signin" className="nav-link" activeProps={{ className: "nav-link is-active" }}>Log In</Link>: <div>Hello {loggedInUser}</div>}
    </div>
}