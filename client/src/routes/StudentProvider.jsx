import { createContext, useState, useEffect } from "react";

export const StateContext = createContext();

/**
 * StateProvider is a context provider component that manages and provides
 * state for lessonID and quizSettings to its child components.
 *
 * @param {Object} props - The props object.
 * @param  props.children - The child components that will consume the context.
 * @returns {JSX.Element} The context provider with state and handlers.
 */
export const StateProvider = ({ children }) => {
  const [lessonID, setLessonID] = useState(false);
  const [quizSettings, setQuizSettings] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const onComplete = (newLessonID) => {
    setLessonID(newLessonID);
  };

  const onStartQuiz = (settings) => {
    setQuizSettings(settings);
  };

  useEffect(() => {
    setIsInitialized(true);
    console.log("is init:", { isInitialized });
    console.log("StateProvider rendered with:", { lessonID, quizSettings });
  }, [lessonID, quizSettings]);
  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  return (
    <StateContext.Provider
      value={{ lessonID, quizSettings, onComplete, onStartQuiz }}
    >
      {children}
    </StateContext.Provider>
  );
};
