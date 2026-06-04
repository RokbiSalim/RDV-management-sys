import { RoleProvider } from './context/roleContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <ErrorBoundary>
      <RoleProvider>
        <AppRouter />
      </RoleProvider>
    </ErrorBoundary>
  );
}

