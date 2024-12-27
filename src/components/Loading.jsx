import { useState,useEffect } from 'react'
import { Background } from './Background'
import Runner from './Runner'

export default function Loading() {
    const gif_urls = ["https://media.tenor.com/cJtDhl2-MP0AAAAi/goku-dragon-ball.gif", "https://media.tenor.com/YE4d6BrNbGoAAAAj/boo-dudu-run.gif","https://media.tenor.com/dldWwvq08fcAAAAj/turtlecoin-running.gif","https://media.tenor.com/OB3d0YMygxYAAAAi/crying-sad.gif","https://media.tenor.com/sUDvToJwQFcAAAAi/running-pizza-tower.gif"]
    const randomIndex = Math.floor(Math.random() * gif_urls.length);
  const gifUrl = gif_urls[randomIndex]
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.src = gifUrl
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
    <Background/>
    <h1 className="text-3xl font-bold text-white mb-4 text-center relative z-10 playwrite-au-vic-guides-regular">Roadmap Loading...</h1>
    <Runner gifUrl={gifUrl} />
    </div>
  )
}