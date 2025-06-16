import React from 'react';
import { CollaborationProvider } from '../collaboration/CollaborationProvider';
import { TweetEditor } from '../features/tweet-editor/TweetEditor';

function App() {
  return (
    <CollaborationProvider>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <AppContent />
      </div>
    </CollaborationProvider>
  );
}

// A simple component to ensure it's rendered inside the provider context
const AppContent = () => {
  return <TweetEditor />;
};


export default App;