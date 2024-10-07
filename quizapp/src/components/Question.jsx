import React from 'react';
import '../styles/Question.css'; // Pastikan jalur ini benar

function Question({ data, handleAnswer }) {
  const answers = [...data.incorrect_answers, data.correct_answer].sort();

  return (
    <div className="question-container">
      <h3>{data.question}</h3>
      <div className="options"> {/* Tambahkan div untuk mengelompokkan pilihan */}
        {answers.map((answer, idx) => (
          <button 
            key={idx} 
            className="option-button"  // Tambahkan className untuk tombol
            onClick={() => handleAnswer(answer === data.correct_answer)}
            // Menambahkan role dan aria-label untuk aksesibilitas
            role="button" 
            aria-label={`Choose answer: ${answer}`}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
