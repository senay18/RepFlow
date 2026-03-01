/* eslint-disable react-refresh/only-export-components */
import { createRoot } from 'react-dom/client'
import Header from './header.jsx'
import Body from './body.jsx'
import './app.css'


function Page(){
  return(
    <>
    <Header />
    <Body />
    </>
  )
}



createRoot(document.getElementById('root')).render(< Page/>)

