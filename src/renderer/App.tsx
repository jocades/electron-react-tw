import './App.css'
import 'tailwindcss/tailwind.css'
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home, Translate } from '@/pages'

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/translate' element={<Translate />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}
