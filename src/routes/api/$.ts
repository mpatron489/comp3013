import { createFileRoute } from '@tanstack/react-router';
import { auth } from '../../auth'

export const Route = createFileRoute('/api/$')({
    server: {
        handlers :{
            GET: async ({request}: {request: Request}) =>{
                return await auth.handler(request)
            },
            POST: async ({request}: {request: Request}) =>{
                return await auth.handler(request)
            },
        },
    },
})