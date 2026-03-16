import { create }from 'zustand'

interface UserStore {
    loginState : boolean,
    userName : string,
    sessionToken: string,
    login : (userName : string, sessionToken : string) => void,
    logout : (userName : string) => void
}

export const userStore = create<UserStore>(
        (set)=> ({
            loginState : false,
            userName : '',
            sessionToken: '',
            login : (userName : string, sessionToken : string) => 
                set({loginState : true,
                     userName : userName,
                     sessionToken : sessionToken}),
            logout : () => 
                set({loginState : false, userName : '', sessionToken : ''})
        })
    );