import { createServerFn } from "@tanstack/react-start"
import { db } from '../db'
import { jokes } from "#/db/schema";


const addJoke = createServerFn({ method : 'POST'})
.inputValidator((data)=>{
    if (!(data instanceof FormData)){
        throw new Error( `That Joke wasn't funny` );
    }

    return {
        jokeContent: data.get('content')?.toString() || ''
    }
})
.handler(async( { data }) => {
    await db.insert(jokes).values( )
})
export default function JokeAdder(){

}
