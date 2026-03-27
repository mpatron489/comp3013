import { Link } from "@tanstack/react-router";
import type {LoggedInProps} from "../types";
import { userStore } from "../userStore";
import { authClient } from "#/auth-client";


export default function LoginButton(){
    const loggedInUser = authClient.useSession().data?.user
    
    return<div>
        {!loggedInUser ? <Link to="/signin" className="nav-link" activeProps={{ className: "nav-link is-active" }}>Log In</Link>: <div>Hello {loggedInUser.name}</div>}
    </div>
}