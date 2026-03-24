/* eslint-disable react-refresh/only-export-components */
// Mount the app's page layout into the root DOM node.
import { createRoot } from 'react-dom/client'
import Header from './header.jsx'
import Body from './body.jsx'
import './app.css'


// Combine the header and main content for the app shell.
function Page(){
  return(
    <>
    <Header />
    <Body />
    </>
  )
}


// Start the React application.
createRoot(document.getElementById('root')).render(< Page/>)
