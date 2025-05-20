import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchGroupStudentsWithScores } from '../../services/ProfServices';
import { getGroupInfo, getQuizAssignments, saveQuizAttempt } from '../../services/StudentService';
import GroupStatSkeleton from '../../components/Skeletons/GroupStatSkeleton';
import { FaCalendarAlt, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import toast from 'react-hot-toast';

const GroupStatistics = ({ groupid: propGroupId, groupName: propGroupName }) => {
  const { groupid: paramGroupId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramGroupName = queryParams.get('groupName');
  const groupid = propGroupId || paramGroupId;
  const groupName = propGroupName || paramGroupName;

  const [groupInfo, setGroupInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState(null);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingAttempt, setLoadingAttempt] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoadingGroup(true);
        const info = await getGroupInfo(groupid);
        setGroupInfo(info);
      } catch (err) {
        setError('Failed to load group info.');
      } finally {
        setLoadingGroup(false);
      }
    };

    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const studentsData = await fetchGroupStudentsWithScores(groupid);
        setStudents(studentsData);
      } catch (err) {
        setError('Failed to load group students and scores.');
      } finally {
        setLoadingStudents(false);
      }
    };

    const fetchAssignments = async () => {
      try {
        setLoadingAssignments(true);
        const assignmentsData = await getQuizAssignments(groupid);
        console.log(assignmentsData)
        setAssignments(assignmentsData);
      } catch (err) {
        setError('Failed to load group assignments.');
      } finally {
        setLoadingAssignments(false);
      }
    };

    if (groupid) {
      fetchGroupData();
      fetchStudents();
      fetchAssignments();
    }
  }, [groupid]);


  if (loadingGroup || loadingStudents || loadingAssignments) {
    return <GroupStatSkeleton/>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <p>Submit feedBack is not working yet</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Group Info Section - Full Width */}
          <div className="lg:col-span-3">
            {groupInfo && (
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h1 className="text-3xl font-bold mb-2">{groupInfo.group_name || groupName || groupid}</h1>
                <p className="text-gray-600 mb-4">{groupInfo.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
            <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-2">
              <FaCalendarAlt className="text-blue-500" />
              <span className="font-semibold">Created:</span>{' '}
              {new Date(groupInfo.created_at).toLocaleDateString()}
            </div>
            <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-2">
              <FaUsers className="text-green-500" />
              <span className="font-semibold">Members:</span> {groupInfo.students?.length || 0}
            </div>
            <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-2">
              <FaChalkboardTeacher className="text-purple-500" />
              <span className="font-semibold">Professor:</span> {groupInfo.prof_name || 'N/A'}
            </div>
                </div>
              </div>
            )}
          </div>

          {/* Student Leaderboard - 2 Columns */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-2xl font-semibold mb-6 text-center border-b pb-3">Student Leaderboard</h2>
                {students.length === 0 ? (
                  <p className="text-center text-gray-500">No students found in this group.</p>
                ) : (
                  <div className="grid gap-4 max-h-[600px] overflow-y-auto">
              {students
                .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
                .map((student, index) => (
                  <div
                    key={student.uid}
                    className={`p-4 md:mx-6 md:my-2  rounded-lg shadow-sm transition-all hover:scale-[1.02] cursor-pointer
                ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400' :
                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-400' :
                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400' :
                  'bg-white border border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${index === 0 ? 'bg-yellow-400 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-400 text-white' :
                      'bg-blue-100 text-blue-800'}`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{student.username}</h3>
                    <p className="text-sm text-gray-500">
                      {student?.totalAttempts || 0} assignments completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {student.averageScore !== undefined ? `${student.averageScore.toFixed(1)}%` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Average Score</div>
                  </div>
                </div>
                    </div>
                  </div>
                ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assignments Section - 1 Column */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-2xl font-semibold mb-6 text-center border-b pb-3">Group Assignments</h2>
                {assignments.length === 0 ? (
                  <p className="text-center text-gray-500">No assignments found for this group.</p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id || assignment.quizId}
                  className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                  // onClick={() => handleAssignmentClick(assignment)}
                >
                  <div className="space-y-2">
                    <span className="font-medium text-lg block">{assignment.title}</span>
                    <span className="text-sm text-gray-600 block">
                    createdAt: {assignment.createdAt ? new Date(assignment.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
                  </div>
                )}
              </div>
            </div>

        {/* Attempt Details  */}

      </div>
    </div>
  );
};

export default GroupStatistics;
