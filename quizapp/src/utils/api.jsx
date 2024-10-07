import axios from 'axios';

export const fetchQuestions = async () => {
  const response = await axios.get(
    'https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple'
  );
  return response.data.results;
};
