import { Chess } from 'chess.js';
import { useEffect, useState } from 'react';

// Chess piece Unicode characters
const pieceIcons = {
  wp: "♙",
  bp: "♟",
  wr: "♖",
  br: "♜",
  wn: "♘",
  bn: "♞",
  wb: "♗",
  bb: "♝",
  wq: "♕",
  bq: "♛",
  wk: "♔",
  bk: "♚",
};

function Board({ style }) {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState("");
  const [showPromotion, setShowPromotion] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    updateGameStatus();
  }, [position]);

  const updateGameStatus = () => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setGameStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`);
      } else if (game.isDraw()) {
        if (game.isStalemate()) {
          setGameStatus("Game ended in stalemate.");
        } else if (game.isThreefoldRepetition()) {
          setGameStatus("Game ended in draw by threefold repetition.");
        } else if (game.isInsufficientMaterial()) {
          setGameStatus("Game ended in draw due to insufficient material.");
        } else {
          setGameStatus("Game ended in draw.");
        }
      }
    } else if (game.isCheck()) {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'} is in check.`);
    } else {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'} to move.`);
    }
  };

  const getSquareColor = (i, j) => {
    const isEven = (i + j) % 2 === 0;
    return isEven 
      ? style?.light || "#f0d9b5" 
      : style?.dark || "#b58863";
  };

  const handleClick = (square) => {
    // If the game is over, prevent further moves
    if (game.isGameOver()) return;

    if (selected && moves.includes(square)) {
      // Check if it's a pawn promotion move
      const piece = game.get(selected);
      const isPawnPromotion = piece && 
        piece.type === 'p' && 
        ((piece.color === 'w' && square[1] === '8') || 
         (piece.color === 'b' && square[1] === '1'));

      if (isPawnPromotion) {
        setShowPromotion(true);
        setPendingMove({ from: selected, to: square });
      } else {
        makeMove({ from: selected, to: square });
      }
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        const legalMoves = game.moves({ square, verbose: true });
        setSelected(square);
        setMoves(legalMoves.map((m) => m.to));
      } else {
        setSelected(null);
        setMoves([]);
      }
    }
  };

  const makeMove = (moveObj) => {
    try {
      const newHistoryItem = {
        move: game.move(moveObj),
        fen: game.fen()
      };
      
      setHistory([...history, newHistoryItem]);
      setSelected(null);
      setMoves([]);
      setPosition(game.fen());
      setShowPromotion(false);
      setPendingMove(null);
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  const handlePromotion = (pieceType) => {
    if (pendingMove) {
      makeMove({
        from: pendingMove.from,
        to: pendingMove.to,
        promotion: pieceType
      });
    }
  };

  const undoMove = () => {
    if (history.length > 0) {
      game.undo();
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setPosition(game.fen());
      setSelected(null);
      setMoves([]);
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setSelected(null);
    setMoves([]);
    setGameStatus("White to move.");
    setHistory([]);
  };

  const renderBoard = () => {
    const board = game.board();
    return board.map((row, i) => (
      <div key={i} className="flex">
        {row.map((square, j) => {
          const squareName = String.fromCharCode(97 + j) + (8 - i);
          const piece = square ? `${square.color}${square.type}` : "";
          const isHighlight = moves.includes(squareName);
          const isSelected = selected === squareName;
          
          return (
            <div
              key={squareName}
              onClick={() => handleClick(squareName)}
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-3xl sm:text-4xl cursor-pointer relative"
              style={{
                backgroundColor: isSelected
                  ? "rgba(106, 154, 232, 0.8)"
                  : isHighlight
                  ? "rgba(144, 238, 144, 0.7)"
                  : getSquareColor(i, j),
              }}
            >
              {piece && <div className={`${square.color === 'w' ? 'text-white' : 'text-black'}`}>
                {pieceIcons[piece]}
              </div>}
              
              {/* Coordinate labels */}
              {j === 0 && (
                <span className="absolute left-1 top-0 text-xs font-bold opacity-70">
                  {8 - i}
                </span>
              )}
              {i === 7 && (
                <span className="absolute right-1 bottom-0 text-xs font-bold opacity-70">
                  {String.fromCharCode(97 + j)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  const renderPromotionOptions = () => {
    if (!showPromotion) return null;
    
    const color = game.turn();
    const promotionPieces = ['q', 'r', 'n', 'b'];
    
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded shadow-lg z-10">
        <div className="text-center mb-2 text-gray-800">Choose promotion piece:</div>
        <div className="flex">
          {promotionPieces.map(piece => (
            <div 
              key={piece} 
              onClick={() => handlePromotion(piece)}
              className="w-12 h-12 flex items-center justify-center text-3xl cursor-pointer hover:bg-gray-200"
            >
              {pieceIcons[`${color}${piece}`]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-lg font-semibold">{gameStatus}</div>
      <div className="relative border-8 border-gray-800 rounded-xl">
        {renderBoard()}
        {renderPromotionOptions()}
      </div>
      
      <div className="mt-4 flex gap-4">
        <button 
          onClick={undoMove} 
          disabled={history.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Undo Move
        </button>
        <button 
          onClick={resetGame}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          New Game
        </button>
      </div>
    </div>
  );
}

export default Board;