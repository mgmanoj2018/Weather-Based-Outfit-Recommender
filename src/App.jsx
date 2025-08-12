import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Button} from './components/ui/button'
import WeatherComponent from './components/WeatherComponent'
import Header from './components/Header'
// import SearchBar from './components/SearchBar'
// import SearchWeather from './components/SearchBar'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header/>
      <main className="p-6">
         {/* < SearchBar /> */}
        <WeatherComponent />
      </main>
    </div>
    </>
  )
}

export default App
