// src/App.tsx

import { YjsProvider } from './providers/YjsProvider';
import { CollaborativeEditor } from './features/text-editor/CollaborativeEditor';
import { ConnectionStatus } from './components/ConnectionStatus';
import { ThemeProvider } from './providers/ThemeProvider';
import { ThemeSwitcher } from './components/ThemeSwitcher';

function App() {
  return (
    // Add these props to configure next-themes correctly for Tailwind
    <ThemeProvider>
      <YjsProvider>
        <ThemeSwitcher />
        <ConnectionStatus />
        <CollaborativeEditor />
      </YjsProvider>
    </ThemeProvider>
  );
}

export default App;