import { useState, useEffect } from 'react';

// Componente principale dell'app
export default function QuizApp() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [quizTitle, setQuizTitle] = useState('Quiz');

  // Carica il file delle domande
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        
        // Estrai il titolo del quiz dalla prima riga
        const firstLine = fileContent.split('\n')[0];
        setQuizTitle(firstLine);
        
        // Estrai le domande e risposte
        const questions = [];
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');
        
        // Cerca la riga che inizia con "Soluzioni"
        let solutionsLineIndex = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('Soluzioni')) {
            solutionsLineIndex = i;
            break;
          }
        }
        
        if (solutionsLineIndex === -1) {
          throw new Error("Formato del file non valido: impossibile trovare la sezione Soluzioni");
        }
        
        // Estrai le soluzioni
        const solutionsLine = lines[solutionsLineIndex + 1]; // Prendi la riga dopo "Soluzioni"
        const solutionsParts = solutionsLine.split(' ');
        const solutions = {};
        
        solutionsParts.forEach(part => {
          if (part.includes('-')) {
            const [index, answer] = part.split('-');
            solutions[parseInt(index)] = answer;
          }
        });
        
        // Estrai domande e opzioni
        let currentQuestion = null;
        for (let i = 1; i < solutionsLineIndex; i++) {
          const line = lines[i].trim();
          
          // Verifica se è una nuova domanda (inizia con un numero seguito da punto o da "Qual")
          if (/^\d+[\.\)]/.test(line) || line.startsWith('Qual ') || /^[A-Za-z]+ è/.test(line) || line.startsWith('Chi ') || line.startsWith('Come ') || line.startsWith('Che ') || line.startsWith('Per ') || line.startsWith('Il ') || line.startsWith('In ') || line.startsWith('L\'') || line.startsWith('Entro ')) {
            // Se abbiamo già una domanda, aggiungiamola all'array
            if (currentQuestion) {
              questions.push(currentQuestion);
            }
            
            // Estrai la domanda e le opzioni di risposta
            const questionMatch = line.match(/^(?:\d+[\.\)]|\s+|[A-Za-z]+\s+è|Qual|Chi|Come|Che|Per|Il|In|L'|Entro)(.+)\s+A\)\s+(.+)\s+B\)\s+(.+)\s+C\)\s+(.+)\s+D\)\s+(.+)$/);
            
            if (questionMatch) {
              const questionNumber = questions.length + 1;
              const questionText = questionMatch[1].trim();
              const options = [
                questionMatch[2].trim(),
                questionMatch[3].trim(),
                questionMatch[4].trim(),
                questionMatch[5].trim()
              ];
              
              // Trova la risposta corretta
              const correctLetterAnswer = solutions[questionNumber];
              let correctAnswer = '';
              
              switch (correctLetterAnswer) {
                case 'A': correctAnswer = options[0]; break;
                case 'B': correctAnswer = options[1]; break;
                case 'C': correctAnswer = options[2]; break;
                case 'D': correctAnswer = options[3]; break;
              }
              
              currentQuestion = {
                question: questionText,
                options: options,
                correctAnswer: correctAnswer,
                letterAnswer: correctLetterAnswer
              };
            }
          }
        }
        
        // Aggiungi l'ultima domanda se presente
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        
        if (questions.length === 0) {
          throw new Error("Nessuna domanda trovata nel file");
        }
        
        setQuizData(questions);
        setFileLoaded(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
      } catch (error) {
        alert('Errore nel caricamento del file: ' + error.message);
        console.error(error);
      }
    };
    reader.readAsText(file);
  
    // Carica anche il quiz predefinito dalla Riforma del Sistema di Riscossione
    loadDefaultQuiz();
  };
  
  // Carica il quiz predefinito
  const loadDefaultQuiz = () => {
    // Dati del quiz sulla Riforma del Sistema di Riscossione
    const defaultQuizData = [
      {
        question: "Qual è l'obiettivo principale del D.Lgs. 110/2024?",
        options: ["Eliminare le cartelle esattoriali", "Riformare il sistema previdenziale", "Riformare il sistema di riscossione", "Ridurre le aliquote IVA"],
        correctAnswer: "Riformare il sistema di riscossione",
        letterAnswer: "C"
      },
      {
        question: "Quale ente effettua la riscossione per conto di diversi enti pubblici?",
        options: ["Ministero del Tesoro", "Agenzia delle entrate–riscossione", "Corte dei Conti", "INPS"],
        correctAnswer: "Agenzia delle entrate–riscossione",
        letterAnswer: "B"
      },
      {
        question: "A partire da quale data si applicano le nuove procedure di discarico?",
        options: ["1° gennaio 2024", "1° gennaio 2025", "31 dicembre 2024", "8 agosto 2024"],
        correctAnswer: "1° gennaio 2025",
        letterAnswer: "B"
      },
      {
        question: "Che tipo di dilazione è stata abolita dalla nuova normativa?",
        options: ["Ordinaria", "Straordinaria", "Entrambe", "Nessuna"],
        correctAnswer: "Entrambe",
        letterAnswer: "C"
      },
      {
        question: "Qual è il massimo numero di rate previsto dalla nuova disciplina di rateizzo?",
        options: ["72", "84", "108", "120"],
        correctAnswer: "120",
        letterAnswer: "D"
      },
      {
        question: "Cosa introduce l'art. 5 del decreto?",
        options: ["La sospensione delle cartelle", "La riscossione dopo il discarico", "Il blocco dei pagamenti", "L'accesso all'ISEE"],
        correctAnswer: "La riscossione dopo il discarico",
        letterAnswer: "B"
      },
      {
        question: "Chi è competente per i controlli sull'Agente della riscossione?",
        options: ["Banca d'Italia", "Corte di Cassazione", "Agenzia delle entrate e Ministero dell'economia", "Consiglio di Stato"],
        correctAnswer: "Agenzia delle entrate e Ministero dell'economia",
        letterAnswer: "C"
      },
      {
        question: "Quale norma è stata modificata per consentire l'impugnazione del ruolo?",
        options: ["Art. 28ter", "Art. 45", "Art. 12 del D.P.R. 602/1973", "Art. 19 del D.Lgs. 546/1992"],
        correctAnswer: "Art. 12 del D.P.R. 602/1973",
        letterAnswer: "C"
      },
      {
        question: "Il nuovo comma 4-bis consente l'impugnazione del ruolo quando il debitore:",
        options: ["Ha già pagato tutto", "Dimostra un pregiudizio", "Riceve un bonus", "Non ha l'ISEE"],
        correctAnswer: "Dimostra un pregiudizio",
        letterAnswer: "B"
      },
      {
        question: "L'Agente può notificare atti di recupero entro:",
        options: ["30 giorni", "6 mesi", "9 mesi", "12 mesi"],
        correctAnswer: "9 mesi",
        letterAnswer: "C"
      },
      // Continua con le altre domande...
      {
        question: "Qual è la legge delega che ha originato il D.Lgs. 110/2024?",
        options: ["Legge 112/1999", "Legge 111/2023", "Legge 300/1999", "Legge 472/1997"],
        correctAnswer: "Legge 111/2023",
        letterAnswer: "B"
      },
      {
        question: "Qual è una delle principali criticità del sistema precedente alla riforma?",
        options: ["Eccessiva automazione", "Inefficiente gestione dei crediti erariali", "Carenza di personale", "Sovrapposizione di norme"],
        correctAnswer: "Inefficiente gestione dei crediti erariali",
        letterAnswer: "B"
      },
      {
        question: "Qual è uno degli strumenti previsti per rafforzare la riscossione?",
        options: ["Riduzione delle aliquote", "Incremento della soglia di notifica", "Rafforzamento dei poteri di iscrizione ipotecaria", "Esenzione fiscale per i debitori"],
        correctAnswer: "Rafforzamento dei poteri di iscrizione ipotecaria",
        letterAnswer: "C"
      },
      {
        question: "Come devono essere pianificate le attività di riscossione?",
        options: ["Triennalmente", "Mensilmente", "Annualmente", "Ogni 5 anni"],
        correctAnswer: "Annualmente",
        letterAnswer: "C"
      },
      {
        question: "Chi stipula la convenzione per la pianificazione delle attività di riscossione?",
        options: ["Agenzia delle entrate e Ministero dell'interno", "Ministero dell'economia e Agenzia delle entrate", "Corte dei Conti e Ministero del lavoro", "ADER e Parlamento"],
        correctAnswer: "Ministero dell'economia e Agenzia delle entrate",
        letterAnswer: "B"
      }
    ]; // Aggiunte le prime 15 domande
    
    setQuizTitle("Quiz – Riforma del Sistema di Riscossione (D.Lgs. 110/2024)");
    setQuizData(defaultQuizData);
    setFileLoaded(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };

  // Gestisce la selezione della risposta
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === quizData[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  // Passa alla domanda successiva
  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Riavvia il quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  // Inizializza il quiz automaticamente al caricamento del componente
  useEffect(() => {
    // Carica il quiz predefinito all'apertura dell'app
    loadDefaultQuiz();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">{quizTitle}</h1>
        
        {!fileLoaded ? (
          <div className="mb-6">
            <p className="text-center mb-4">Caricamento quiz in corso...</p>
          </div>
        ) : quizCompleted ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Quiz Completato!</h2>
            <p className="text-lg mb-4">Punteggio finale: {score} su {quizData.length}</p>
            <p className="mb-6">
              {score === quizData.length 
                ? "Ottimo lavoro! Hai risposto correttamente a tutte le domande." 
                : score > quizData.length * 0.7 
                  ? "Buon risultato! Hai una buona conoscenza dell'argomento."
                  : "Continua a studiare l'argomento per migliorare il tuo punteggio."}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRestartQuiz}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Riavvia Quiz
              </button>
              <input 
                type="file" 
                accept=".txt" 
                onChange={handleFileUpload} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                id="fileInput"
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="fileInput" 
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
              >
                Carica altro quiz
              </label>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2 flex justify-between text-sm">
              <span>Domanda {currentQuestionIndex + 1} di {quizData.length}</span>
              <span>Punteggio: {score}</span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">{quizData[currentQuestionIndex]?.question}</h2>
              
              <div className="space-y-3">
                {quizData[currentQuestionIndex]?.options.map((option, index) => {
                  const letterOptions = ['A', 'B', 'C', 'D'];
                  return (
                    <button
                      key={index}
                      onClick={() => !showResult && handleAnswerSelect(option)}
                      disabled={showResult}
                      className={`block w-full text-left p-3 rounded-lg transition ${
                        selectedAnswer === option
                          ? option === quizData[currentQuestionIndex].correctAnswer
                            ? 'bg-green-100 border border-green-500'
                            : 'bg-red-100 border border-red-500'
                          : showResult && option === quizData[currentQuestionIndex].correctAnswer
                          ? 'bg-green-100 border border-green-500'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-semibold">{letterOptions[index]}) </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {showResult && (
              <div className="mb-4 p-3 rounded-lg bg-gray-50">
                <p className="font-medium">
                  {selectedAnswer === quizData[currentQuestionIndex].correctAnswer
                    ? '✅ Corretto!'
                    : `❌ Sbagliato! La risposta corretta è: ${quizData[currentQuestionIndex].letterAnswer}) ${quizData[currentQuestionIndex].correctAnswer}`}
                </p>
              </div>
            )}
            
            {showResult && (
              <button
                onClick={handleNextQuestion}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                {currentQuestionIndex < quizData.length - 1 ? 'Prossima Domanda' : 'Vedi Risultato'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}