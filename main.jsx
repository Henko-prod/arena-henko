import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './ArenaHenko.jsx'
import ShowsPortfolio from './ShowsPortfolio.jsx'

const isShowsPortfolio = /^\/shows\/?$/.test(window.location.pathname)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isShowsPortfolio ? <ShowsPortfolio /> : <App />}
  </React.StrictMode>,
)
