import { MemoryRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import 'tailwindcss/tailwind.css'
import { Toaster } from 'sonner'
import { Home } from '@/pages/home'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}
