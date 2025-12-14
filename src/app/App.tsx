import { ThemeProvider } from '@components/theme-provider'
import './App.css'
function App() {

  return (
   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     <h1 className='text-blue-600'>Hello</h1>
    </ThemeProvider>
  )
}

export default App
