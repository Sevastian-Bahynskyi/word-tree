export interface Suggestion {
    id: string;
    text: string;
    votes: number;
    authorId: string; // Know who created it
    votedBy: string[]; // Keep track of who voted
}

export interface Word {
    id: string;
    text: string;
    suggestions: Suggestion[];
}