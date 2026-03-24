import './app.css'
import headerImg from "./assets/gym.png"

// Render the logo and app title at the top of the page.
export default function Header() {

  return (
      <div className=' h-auto w-auto header flex justify-center items-center'>
          <img className=' gap-4 m-0 h-20' src={headerImg}></img>
          <h1 className=' font-[JetBrains-mono] text-Black text-3xl '>RepFlow</h1>
      </div>
)}
