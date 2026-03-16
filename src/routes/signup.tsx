import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { authClient } from "../auth-client";
import { useState } from 'react'
import { userStore } from "#/userStore";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const [loading, setLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<Array<string>>([]);
  const login = userStore ((state)=> state.login);
  const navigate = useNavigate();
  const validPasswordClass = 'w-75 self-center bg-white border-2 border-cyan-800 rounded m-3 p-0.5 text-black';
  const invalidPasswordClass = 'w-75 self-center bg-white border-2 border-red-600 rounded m-3 p-0.5 text-black'
  if(loading){
    return <div>Signing In</div>
  }
  return (<div className="flex flex-col h-screen justify-center content-center text-center">
    <form onSubmit={handleSignUp} className="flex flex-col">
      <h1 className="text-4xl pb-5">Sign Up</h1>
      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" className="w-75 self-center bg-white border-2 border-cyan-800 rounded m-3 p-0.5 text-black"/>
      <label htmlFor="userName">UserName</label>
      <input type="text" name="userName" id="userName" className="w-75 self-center bg-white border-2 border-cyan-800 rounded m-3 p-0.5 text-black"/>
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" className={passwordValid ? validPasswordClass : invalidPasswordClass}/>
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input type="password" name="confirmPassword" id="confirmPassword" className={passwordValid ? validPasswordClass : invalidPasswordClass}/>
      {/* <div className="text-red-600">
        {errorMessage ? errorMessage : ''}
      </div> */}
      {errorMessage.map((m)=>{
        return (<div className="text-red-600">{m}</div>)
      })}
      <button type="submit" className="bg-brand box-border self-center w-40 m-3 border rounded-md hover:cursor-pointer hover:bg-cyan-700 focus:ring-2 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
        Sign Up
      </button>
    </form>
    </div>)

  async function handleSignUp(event: React.SubmitEvent<HTMLFormElement> ){
  event.preventDefault();
  setLoading(true);
  setErrorMessage([]);
  
  const formData = new FormData(event.target);
  
  const email = formData.get('email') as string;
  const userName = formData.get('userName') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if(!passwordIsValid(password, confirmPassword)){
    setPasswordValid(false);
  }
  else{
  await authClient.signUp.email({
    email: email,
    name: userName,
    password: password,
    callbackURL: '/about'
  },
  {
    onRequest: (ctx) =>{
      setLoading(true);
    },
    onSuccess: (ctx) => {
      login(userName, JSON.stringify(ctx.data.token));
      setLoading(false);
      navigate({to: '/about'});
    },
    onError: (ctx) => {
      setErrorMessage([...errorMessage, ctx.error.message]);
    }
  })
  }
  setLoading(false);
}

function passwordIsValid( password: string, confirmPassword: string ){
  if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)){
    setErrorMessage(['Password is Invalid, Try a More Secure Password']);
  }
  if(!(password === confirmPassword)){
    setErrorMessage([...errorMessage, 'Passwords Do Not Match'] );
  }
  if(errorMessage.length === 0){
    return true;
  }
  return false;
}

}


