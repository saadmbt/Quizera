import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getGroupById, updateGroup } from '../../services/ProfServices';
import { AuthContext } from '../../components/Auth/AuthContext';

const GroupEditpage = () => {
  const { groupid } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [formData, setFormData] = useState({
    group_name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        console.log('Fetching group with groupid:', groupid, 'and profId:', user.uid);
        if (!user) {
          setError('User not logged in');
          setLoading(false);
          localStorage.setItem('redirectAfterLogin', `/professor/group/${groupid}/edit`);
          navigate('/auth/login');
          return;
        }
        const groupData = await getGroupById(groupid, user.uid);
        if (groupData.error) {
          setError(groupData.error);
        } else {
          setGroup(groupData);
          setFormData({
            group_name: groupData.group_name || '',
            description: groupData.description || '',
          });
        }
      } catch (err) {
        setError('Failed to fetch group data');
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupid]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('User not logged in');
      return;
    }
    try {
      const response = await updateGroup(groupid, user.uid, formData);
      if (response.success) {
        alert('Group updated successfully');
      } else {
        alert('Failed to update group: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error updating group: ' + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/professor" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Accueil
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit Group</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <label htmlFor="group_name" className="block font-medium mb-1">Group Name</label>
          <input
            type="text"
            id="group_name"
            name="group_name"
            value={formData.group_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default GroupEditpage;
