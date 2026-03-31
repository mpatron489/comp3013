export type LoggedInProps = {
    loggedIn: boolean
}

export type JokeData = {
    id: string
    jokeContent: string
    jokeUserId: string
    userName: string
    upvotes: number
    downvotes: number
    currentUserVote: boolean | null
    isOwner: boolean
}
