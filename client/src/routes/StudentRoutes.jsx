import { Route } from 'react-router-dom';
import StudentDashboardLayout from '../layouts/StudentDashboardLayout';
import Studentmainpage from '../pages/Dashboard/Studentmainpage';
import Quizzespage from '../pages/Dashboard/Quizzespage';
import QuizDetailspage from '../pages/Dashboard/QuizDetailspage';
import FlashcardsSection from '../components/dashboard/FlashcardDeckSection';
import FlashcardStudy from '../components/dashboard/FlashCardStudy';
import Upload from '../pages/Dashboard/uploadpage';
import QuizSetup from '../pages/Dashboard/QuizSetup';
import Quiz from '../pages/Quiz';

const StudentRoutes =(
    <Route path="/Dashboard" element={<StudentDashboardLayout/>}>
      <Route index element={<Studentmainpage />} />
      <Route path="upload" element={<Upload onComplete={() => {}} />} />
      <Route path="quiz/setup" element={<QuizSetup onStartQuiz={() => {}}  />} />
      <Route path="quiz" element={<Quiz settings={null} />} />
      <Route path="quizzes" element={<Quizzespage />} />
      <Route path="quizzes/:id" element={<QuizDetailspage />} />
      <Route path="flashcards" element={<FlashcardsSection />} />
      <Route path="flashcards/study/:id" element={<FlashcardStudy />} />
    </Route>
  );

export default StudentRoutes;
