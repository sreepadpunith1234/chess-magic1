import { useState, useEffect } from 'react';
import Board from './Board';

// Theme definitions - can be moved to a separate styles file if needed
export const boardThemes = [
  { id: 'classic', name: 'Classic', light: '#f0d9b5', dark: '#b58863' },
  { id: 'forest', name: 'Forest Green', light: '#daecd8', dark: '#4a7c59' },
  { id: 'marine', name: 'Marine Blue', light: '#d6e6f2', dark: '#2c5784' },
  { id: 'royal', name: 'Royal Purple', light: '#e5d6eb', dark: '#6a3a82' },
  { id: 'sunset', name: 'Sunset', light: '#ffe6cc', dark: '#d26466' }
];

export default function App() {
  const [style, setStyle] = useState('classic');
  const [showIntro, setShowIntro] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const chessQuotes = [
    "Every chess master was once a beginner. — Irving Chernev",
    "Chess is the gymnasium of the mind. — Blaise Pascal",
    "Chess is life in miniature. Chess is a struggle, chess battles. — Garry Kasparov",
    "Chess is not only knowledge and logic. — Alexander Alekhine",
    "Chess is the struggle against error. — Johannes Zukertort",
    "Chess is beautiful enough to waste your life for. — Hans Ree",
    "Chess is mental torture. — Garry Kasparov",
    "Chess is war over the board. — Bobby Fischer"
  ];

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % chessQuotes.length);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, []);

  // Animated entry for the main content
  useEffect(() => {
    if (!showIntro) {
      document.getElementById('main-content').classList.add('fade-in');
    }
  }, [showIntro]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {showIntro ? (
        <div className="flex flex-col items-center justify-center h-screen animate-fade-in">
          <div className="text-6xl font-bold mb-6 animate-float">♔</div>
          <h1 className="text-5xl font-bold mb-2 animate-slide-up">CHESS MASTER</h1>
          <p className="text-xl mb-8 text-gray-300 animate-slide-up delay-300">Where strategy meets elegance</p>
          <button 
            onClick={() => setShowIntro(false)} 
            className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 animate-pulse"
          >
            Start Playing
          </button>
        </div>
      ) : (
        <div id="main-content" className="opacity-0 transition-opacity duration-1000">
          <header className="p-6 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-4xl mr-2">♔</span>
              <h1 className="text-2xl font-bold">Chess Master</h1>
            </div>
            <nav className="flex items-center gap-6">
              <button className="hover:text-yellow-300 transition-colors">How to Play</button>
              <button className="hover:text-yellow-300 transition-colors">History</button>
              <div className="relative">
                <button 
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
                >
                  <span>Themes</span>
                  <span className="text-xs">▼</span>
                </button>
                {themeMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
                    {boardThemes.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setStyle(theme.id);
                          setThemeMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${style === theme.id ? 'bg-gray-700' : ''}`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </header>
          
          <div className="quotes-scroller bg-gray-800 py-4 mb-8 overflow-hidden">
            <div className="animate-marquee flex">
              {chessQuotes.map((quote, index) => (
                <div key={index} className="mx-12 whitespace-nowrap">{quote}</div>
              ))}
            </div>
          </div>
          
          <main className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 mb-16">
            <div className="lg:w-1/2 flex justify-center transform hover:scale-102 transition-transform">
              <div className="shadow-2xl rounded-xl overflow-hidden">
                <Board 
                  style={boardThemes.find(theme => theme.id === style)} 
                />
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-bold mb-4">Welcome to Chess Master</h2>
              <p className="text-lg text-gray-300">
                Experience the ultimate chess gameplay with our beautiful interactive board. Challenge 
                yourself with our advanced AI opponent or play against friends in real-time.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <FeatureCard 
                  icon="♘"
                  title="Advanced AI"
                  description="Multiple difficulty levels to match your skill"
                />
                <FeatureCard 
                  icon="♖"
                  title="Tournament Play"
                  description="Join online tournaments and test your skills"
                />
                <FeatureCard 
                  icon="♗"
                  title="Strategy Tips"
                  description="Learn from the masters with integrated lessons"
                />
                <FeatureCard 
                  icon="♕"
                  title="Game Analysis"
                  description="Review your matches with professional insights"
                />
              </div>
              
              <div className="flex gap-4 mt-8">
                <button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105">
                  Play vs Computer
                </button>
                <button className="border-2 border-yellow-500 text-yellow-500 px-6 py-3 rounded-full font-bold hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300">
                  Multiplayer
                </button>
              </div>
            </div>
          </main>
          
          <div className="bg-gray-800 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Master Your Game</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <LearningSection 
                  title="Beginner"
                  description="Learn the basics of chess, piece movements, and fundamental strategies."
                  buttonText="Start Learning"
                />
                <LearningSection 
                  title="Intermediate"
                  description="Develop tactical skills, positional understanding, and endgame techniques."
                  buttonText="Improve Skills"
                />
                <LearningSection 
                  title="Advanced"
                  description="Master complex strategies, deep calculations, and psychological elements."
                  buttonText="Master Chess"
                />
              </div>
            </div>
          </div>
          
          <footer className="bg-gray-900 py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400">© 2025 Chess Master. All rights reserved.</p>
              <div className="flex justify-center gap-6 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.8s forwards;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .fade-in {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

// Supporting components
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors duration-300 transform hover:scale-105">
      <div className="text-3xl text-yellow-500 mb-2">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function LearningSection({ title, description, buttonText }) {
  return (
    <div className="bg-gray-900 p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-300">
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <button className="bg-gray-800 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-700">
        {buttonText}
      </button>
    </div>
  );
}
