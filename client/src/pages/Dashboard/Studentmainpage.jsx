import React, { useState, useEffect } from 'react'
import ProgressOverviewSection from '../../components/dashboard/ProgressOverviewSection';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/dashboard/Header'
import QuizHistory from '../../components/dashboard/QuizHistory';
import { History } from 'lucide-react';
import FlashcardsSection from '../../components/dashboard/FlashcardDeckSection';
import StartComponent from '../../components/dashboard/StartComponent';
import { fetchNotifications } from '../../services/StudentService';

function Studentmainpage() {
    const isNew= JSON.parse(localStorage.getItem("isNew")) || false;
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const data = await fetchNotifications();
                if (data && data.data) {
                    setNotifications(data.data);
                } else {
                    setNotifications([]);
                }
            } catch (err) {
                setError('Failed to load notifications');
                console.error(err);
            }
        };
        getNotifications();
    }, []);

    return (
        <>
            <Header isInMain={true} />
            {isNew ? <StartComponent /> : (
                <>
                {/* Notification Section */}
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
                {notifications.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
                        <h3 className="font-semibold mb-2">Notifications</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {notifications.map((notif) => (
                                <li key={notif.assignment_id}>
                                    <strong>{notif.title}:</strong> {notif.message} - Time left: {notif.time_left}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Progress Overview section  */}
                <ProgressOverviewSection />
                {/* Recent Quizzes */}
                <div className="mb-8 px-4 md:px-0">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <History className="h-6 w-6 text-blue-500" />
                            <h2 className="text-xl font-semibold ">Recent Quizzes</h2>
                        </div>
                    </div>
                    <QuizHistory limit={3} showViewAll={true} />
                </div>
                {/* FlashCard section  */}
                <FlashcardsSection limit={3} /> 
                </>
            )}
        </>
    )
}

export default Studentmainpage
