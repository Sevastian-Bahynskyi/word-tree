import React, { useState } from 'react';
import { IWord } from '../../types';
import { ProposalModal } from './ProposalModal';

interface EditableWordProps {
    wordData: IWord;
    wordIndex: number;
}

export const EditableWord: React.FC<EditableWordProps> = ({ wordData, wordIndex }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <span
                className="cursor-pointer font-bold text-blue-600 hover:bg-blue-100 rounded px-1"
                onClick={() => setIsModalOpen(true)}
            >
                {wordData.current}
            </span>
            <ProposalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                wordIndex={wordIndex}
                originalWord={wordData.original}
            />
        </>
    );
};