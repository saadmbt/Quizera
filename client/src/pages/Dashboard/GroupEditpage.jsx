import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getGroupById, updateGroup } from '../../services/ProfServices';
import { AuthContext } from '../../components/Auth/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

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
      toast.error('Please log in to continue', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
        },
      });
      return;
    }

    try {
      const response = await updateGroup(groupid, user.uid, formData);
      if (response.success) {
        toast.success('Group updated successfully!', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#ECFDF5',
            color: '#059669',
            border: '1px solid #059669',
          },
        });
        // Optionally navigate after success
        setTimeout(() => navigate('/professor'), 1500);
      } else {
        throw new Error(response.error || 'Failed to update group');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster /> {/* Add this to render the toasts */}
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
