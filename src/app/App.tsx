import { ThemeProvider } from '@components/theme-provider'
import './App.css'
import { AppRouter } from './router'
function App() {

  return (
   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AppRouter/>
    </ThemeProvider>
  )
}

export default App
