import { YjsProvider } from './providers/YjsProvider';
import { CollaborativeEditor } from './features/text-editor/CollaborativeEditor';
import { ConnectionStatus } from './components/ConnectionStatus';
import { ThemeProvider } from './providers/ThemeProvider';
import { ThemeSwitcher } from './components/ThemeSwitcher';

function App() {
  return (
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