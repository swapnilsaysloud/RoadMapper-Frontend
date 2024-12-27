import { useState, useEffect } from 'react'
import Graph from '../components/Graph'
import { Background } from './Background'
import Loading from './Loading'
import Footer from './Footer'

const backendapi = "https://roadmapper-backend-1.onrender.com"

export default function LearningPage() {
    const [learningTopic, setLearningTopic] = useState('')
    const [isLoading, setIsLoading] = useState(false) 
    const [graphData, setGraphData] = useState(null) 
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('fetching data for topic:', learningTopic);
        try {
              const response = await fetch(`${backendapi}/api/learn?topic=${encodeURIComponent(learningTopic)}`);

              if (!response.ok) {
                throw new Error('Network response not ok');
              }
              const data = await response.json();
              
              console.log(data);
              setGraphData(data);
    
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setIsLoading(false);
          }
        };
    return (
        <>

        { !isLoading && !graphData && ( 
          <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <Background/>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4 text-center relative z-10">What would you like to learn?</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-lg relative z-30">
              <div className="flex gap-2">
               <input
                  type="text"
                  value={learningTopic}
                  onChange={(e) => setLearningTopic(e.target.value)}
                  placeholder="Enter a topic..."
                  className="flex-grow bg-white bg-opacity-10 text-white placeholder-gray-400 border border-gray-600 rounded-md p-3 text-lg"
                />
                <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-md text-lg" style={{
                  backgroundColor: '#03c613',
                  boxShadow: '0 0 10px rgb(30, 188, 43), 0 0 20px rgb(30, 188, 43), 0 0 30px rgb(30, 188, 43)',
                  transition: 'all 0.3s ease'
                }}>
                  Learn
                </button>
              </div>
            </form>
            <Footer/>
          </div> )}

      {isLoading && <Loading/>}

      {!isLoading && graphData && (
        <div className="app-container">
          <div className="graph-wrapper" style={{ width: '100%', height: '600px' }}>
          <Graph data={graphData} />
          </div>
        </div>
      )}

        </>


    )
}