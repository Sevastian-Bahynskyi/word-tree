import * as Y from 'yjs';

export interface IProposal {
    text: string;
    energy: number;
}

export interface IWord {
    original: string;
    current: string;
    proposals: IProposal[];
}

// Y.js specific types for clarity, though not strictly needed for runtime
export type YProposal = Y.Map<string | number>;
export type YWord = Y.Map<string | Y.Array<YProposal>>;