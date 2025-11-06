import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch("/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error connecting to backend'))
  }, [])

  return (
    <h1 style={{ color: 'green' }}>Hello from Green Deployment</h1>
  )
}

export default App
