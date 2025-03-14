import React from 'react'
import ProgressOverviewSection from '../../components/dashboard/ProgressOverviewSection'
import Header from '../../components/dashboard/Header'
function Studentmainpage() {
    const toggleDarkMode = () => {
        try {
        setDarkMode(prev => !prev);
        } catch (err) {
        setError('Failed to toggle theme');
        setTimeout(() => setError(null), 3000);
        }
    };
  return (
    <>
        <Header toggleDarkMode={toggleDarkMode} />
        <ProgressOverviewSection />
    </>
  )
}

export default Studentmainpage