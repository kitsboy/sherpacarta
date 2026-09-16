/**
 * SherpaCarta verify page entry — mounts the public "Verify this proof"
 * surface into #verify-root. Imported only by /verify.html (vite entry).
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import VerifySurface from './components/verify/VerifySurface'
import './verify.css'

const rootEl = document.getElementById('verify-root')
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <VerifySurface />
    </React.StrictMode>,
  )
}
