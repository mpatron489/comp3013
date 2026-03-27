import { userStore } from "#/userStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authClient } from "#/auth-client";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/signin")({
  component: RouteComponent,
});

function RouteComponent() {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const login = userStore ((state)=> state.login);
  const navigate = useNavigate(); 

  if(loading){
    return <div>Signing In</div>
  }

  return (<div className="flex flex-col h-screen justify-center content-center text-center">
    <form onSubmit={handleSignIn}className="flex flex-col">
      <h1 className="text-4xl pb-25">Sign In</h1>
      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" className="w-75 self-center bg-white border-2 border-cyan-800 rounded m-3 p-0.5 text-black"/>
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" className="w-75 self-center bg-white border-2 border-cyan-800 rounded m-3 p-0.5 text-black"/>
      <button type="submit" className="bg-brand box-border self-center w-40 m-3 border rounded-md hover:cursor-pointer hover:bg-cyan-700 focus:ring-2 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
        Log In
      </button>
    </form>
    <div className="text-red-600">{errorMessage}</div>
    <Link
    to="/signup"
    className='p-3'
    >Don't Have An Account? Sign Up</Link>
    </div>);

  async function handleSignIn(event: React.SubmitEvent<HTMLFormElement>){
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    const formData = new FormData(event.target);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await authClient.signIn.email({
      email: email,
      password: password,
      callbackURL: '/about',
      rememberMe: true
    },
    {
      onRequest: (ctx) =>{
        setLoading(true);
      },
      onSuccess: (ctx) =>{
        login(JSON.stringify(ctx.data.email), JSON.stringify(ctx.data.token));
        setLoading(false);
        navigate({to: '/about'});
      },
      onError: (ctx) =>{
        setErrorMessage(ctx.error.message);
      }
    });
    setLoading(false);
}
}


