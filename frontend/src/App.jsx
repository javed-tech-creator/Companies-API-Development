
import { Toaster } from 'react-hot-toast'
import './App.css'
import CompanyTable from './components/CompanyTable'

function App() {

  return (
    <>
   <div className="min-h-screen bg-gray-50">
  
          <CompanyTable />
    </div>
      <Toaster 
        position="top-center"
        toastOptions={{
          success: { 
            style: { background: "#4ade80", color: "#000" } 
          },
          error: {
            style: { background: "#f87171", color: "#000" }
          },
        }}
      />
      </>
  )
}

export default App
