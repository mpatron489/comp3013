import { Link } from "@tanstack/react-router";
import type {LoggedInProps} from "../types";
import { userStore } from "../userStore";
import { authClient } from "#/auth-client";


export default function LoginButton(){
    const loggedInUser = authClient.useSession().data?.user
    
    return<div>
        {!loggedInUser ? <Link to="/signin" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
        Log In
        </Link>
        : <div> 
            <div>Hello {loggedInUser.name}</div>
            <span className="nav-link cursor-pointer" onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/signin' } } })}>Log Out</span>
         </div>}
    </div>
}
