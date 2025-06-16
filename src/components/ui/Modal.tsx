import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {children}
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};