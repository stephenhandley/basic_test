import React from 'react'
import ReactDOM from 'react-dom/client'
import { BasicProvider } from '@basictech/react'
import App from './App'
import './index.css'
import { schema } from '../basic.config'

console.log("schema", schema);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BasicProvider schema={schema} project_id={schema.project_id} debug>
      <App />
    </BasicProvider>
  </React.StrictMode>,
)
