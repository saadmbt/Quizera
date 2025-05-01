import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchGroupStudentsWithScores } from '../../services/ProfServices';
import { db } from '../../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const GroupStatistics = ({ groupid: propGroupId, groupName: propGroupName }) => {
  const { groupid: paramGroupId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramGroupName = queryParams.get('groupName');
  const groupid = propGroupId || paramGroupId;
  const groupName = propGroupName || paramGroupName;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to fetch student info from Firebase by uid
  const fetchStudentInfo = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error fetching student info from Firebase:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchStudentsWithFirebaseInfo = async () => {
      try {
        setLoading(true);
        const studentsData = await fetchGroupStudentsWithScores(groupid);
        // For each student, fetch additional info from Firebase
        const studentsWithFirebase = await Promise.all(
          studentsData.map(async (student) => {
            const firebaseInfo = await fetchStudentInfo(student.uid);
            return {
              ...student,
              name: firebaseInfo?.name || student.name || 'Unnamed Student',
            };
          })
        );
        setStudents(studentsWithFirebase);
      } catch (err) {
        console.error(err);
        setError('Failed to load group students and scores.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsWithFirebaseInfo();
  }, [groupid]);

  if (loading) {
    return <div>Loading group statistics...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Statistics for Group: {groupName || groupid}</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Student Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">Average Score</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="2" className="py-4 px-4 text-center text-gray-500">
                No students found in this group.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.uid}>
                <td className="py-2 px-4 border-b border-gray-300">{student.name}</td>
                <td className="py-2 px-4 border-b border-gray-300">{student.averageScore !== undefined ? student.averageScore.toFixed(2) : 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GroupStatistics;
