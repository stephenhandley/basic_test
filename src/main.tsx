import React from 'react'
import ReactDOM from 'react-dom/client'
import { BasicProvider } from '@basictech/react'

import App from './App'
import './index.css'
import { schema } from '../basic.config'

const projectId = import.meta.env.VITE_BASIC_PROJECT_ID
const projectSchema = {
  ...schema, 
  project_id: projectId
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BasicProvider schema={projectSchema} project_id={projectId} debug>
      <App />
    </BasicProvider>
  </React.StrictMode>
)
