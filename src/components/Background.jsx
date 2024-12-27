

export const Background = () =>{
    return (
        <div 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: -1,
        background: 'linear-gradient(to bottom, #000000, #0f0f3f)',
        overflow: 'hidden',
      }}
    ></div>
    )
}