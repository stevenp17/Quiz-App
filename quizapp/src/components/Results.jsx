import React from 'react';
import '../styles/Results.css'; // Import CSS

function Results({ score, total, answeredCount, onRetry, onLogout }) {
  return (
    <div className="results-container">
      <h2>Results</h2>
      <p>Correct Answers: {score}</p>
      <p>Incorrect Answers: {answeredCount - score}</p>
      <p>Total Questions: {total}</p>
      <p>Questions Answered: {answeredCount}</p>
      <p>Questions Unanswered: {total - answeredCount}</p>
      <button onClick={onRetry}>Retry Quiz</button> {/* Tombol untuk mengulang kuis */}
      <button onClick={onLogout} className="logout-button">Logout</button> {/* Tombol Logout */}
    </div>
  );
}

export default Results;
