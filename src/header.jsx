import './app.css'
import headerImg from "./assets/soccer.png"

export default function Header() {

  return (
      <div className=' h-50 flex justify-center items-center'>
          <img className=' gap-4 m-2 h-20' src={headerImg}></img>
          <h1 className=' font-[JetBrains-mono] text-Black text-2xl '>FootyStandings</h1>
      </div>
)}


