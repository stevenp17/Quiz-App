import React, { useState, useEffect, useCallback } from 'react';
import { fetchQuestions } from '../utils/api';
import Question from './Question';
import Results from './Results';
import '../styles/Quiz.css';
import he from 'he';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state isLoading untuk loading state
  const MAX_RETRIES = 3;

  // Fungsi untuk menyimpan state kuis ke localStorage
  const saveQuizState = useCallback(() => {
    const quizState = {
      currentQuestionIndex,
      score,
      timeLeft,
      quizCompleted,
      answeredCount,
    };
    try {
      localStorage.setItem('quizState', JSON.stringify(quizState));
    } catch (error) {
      console.error("Gagal menyimpan state kuis:", error);
    }
  }, [currentQuestionIndex, score, timeLeft, quizCompleted, answeredCount]);


  // Fungsi untuk memuat state dari localStorage
  const loadQuizState = useCallback(() => {
    const savedQuizState = JSON.parse(localStorage.getItem('quizState'));
    if (savedQuizState) {
      setCurrentQuestionIndex(savedQuizState.currentQuestionIndex || 0);
      setScore(savedQuizState.score || 0);
      setTimeLeft(savedQuizState.timeLeft || 60);
      setQuizCompleted(savedQuizState.quizCompleted || false);
      setAnsweredCount(savedQuizState.answeredCount || 0);
    }
    setIsLoading(false); // Set isLoading false setelah load state
  }, []);


  // Memuat pertanyaan kuis dengan penanganan error
  const loadQuestions = useCallback(async (retries = 0) => {
    try {
      const cachedQuestions = localStorage.getItem("quizQuestions");
      if (cachedQuestions) {
        setQuestions(JSON.parse(cachedQuestions));
        return;
      }

      const data = await fetchQuestions();
      const decodedQuestions = data.map(question => ({
        ...question,
        question: he.decode(question.question),
      }));

      setQuestions(decodedQuestions);
      localStorage.setItem("quizQuestions", JSON.stringify(decodedQuestions));
      setError(null);
    } catch (error) {
      console.error("Error fetching questions:", error);
      if (retries < MAX_RETRIES) {
        setTimeout(() => loadQuestions(retries + 1), 2000); // Retry logic
      } else {
        setError("Failed to fetch questions, please try again."); // Show error message
      }
    }
  }, []);


  // Memuat state kuis yang tersimpan saat komponen dimount
  useEffect(() => {
    loadQuizState(); // Memuat state kuis dari localStorage
    loadQuestions(); // Memuat pertanyaan saat komponen di-mount
  }, [loadQuizState, loadQuestions]);


  // Menyimpan state setiap kali ada perubahan
  useEffect(() => {
    if (!isLoading) {
      saveQuizState();
    }
  }, [currentQuestionIndex, score, timeLeft, quizCompleted, answeredCount, isLoading, saveQuizState]);


  // Atur timer untuk kuis
  useEffect(() => {
    if (isLoading || quizCompleted || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setQuizCompleted(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (!isLoading) {
        saveQuizState();
      }
    };
  }, [quizCompleted, timeLeft, isLoading, saveQuizState]);


  // Menghandle jawaban yang diberikan
  const handleAnswer = useCallback((correct) => {
    setScore(prevScore => prevScore + (correct ? 1 : 0));
    setAnsweredCount(prevCount => prevCount + 1);

    setCurrentQuestionIndex(prevIndex => {
      const nextQuestion = prevIndex + 1;
      if (nextQuestion < questions.length) {
        return nextQuestion;
      } else {
        setQuizCompleted(true);
        return prevIndex;
      }
    });

    saveQuizState();
  }, [questions, saveQuizState]);


  // Menghandle pengulangan kuis
  const handleRetry = useCallback(() => {
    localStorage.removeItem('quizState');
    localStorage.removeItem('quizQuestions');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(60);
    setQuizCompleted(false);
    setError(null);
    setAnsweredCount(0);
    loadQuestions();
  }, [loadQuestions]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>; // Tampilkan loading sementara state dipulihkan
  }


  if (quizCompleted) {
    return (
      <Results
        score={score}
        total={questions.length}
        answeredCount={answeredCount}
        onRetry={handleRetry}
        onLogout={handleLogout}
      />
    );
  }

  
  return (
    <div className="quiz-container">
      <h2>Quiz</h2>
      <p className="timer">Time left: {timeLeft}s</p>
      {Array.isArray(questions) && questions.length > 0 ? (
        <>
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
          <Question
            data={questions[currentQuestionIndex]}
            handleAnswer={handleAnswer}
          />
        </>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}

export default Quiz;
