import './App.css'
import 'tailwindcss/tailwind.css'
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home, Translate } from '@/pages'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { TooltipProvider } from '@/components/ui/tooltip'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <TailwindIndicator />
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/translate' element={<Translate />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
