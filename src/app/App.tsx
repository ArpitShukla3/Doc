import './App.css'
import { AppRouter } from './router'
import { AppProvider } from './AppProvider'
function App() {

  return (
      <AppProvider>
        <AppRouter />
      </AppProvider>
  )
}

export default App
