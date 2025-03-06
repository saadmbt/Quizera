import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlanSelection = () => {
  const navigate = useNavigate();

  const handlePlanSelection = (plan) => {
    // Logic to handle plan selection can be added here
    // For now, just navigate to the dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">Compare Plans</h2>
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-center text-gray-800">Basic</h3>
            <p className="text-center text-gray-600">For students and individuals who need basic features.</p>
            <p className="text-center text-2xl font-bold text-blue-600">$0</p>
            <button
              onClick={() => handlePlanSelection('basic')}
              className="w-full mt-4 px-6 py-3 text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Continue with Basic
            </button>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>1 AI Lesson/month</li>
              <li>Study on the web or download our mobile app</li>
              <li>50mb file limit</li>
            </ul>
          </div>
          <div className="p-6 bg-green-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-center text-gray-800">Premium</h3>
            <p className="text-center text-gray-600">For those who need unlimited AI features.</p>
            <p className="text-center text-2xl font-bold text-green-600">$64/year</p>
            <button
              onClick={() => handlePlanSelection('premium')}
              className="w-full mt-4 px-6 py-3 text-lg text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Buy Plan
            </button>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>Everything in Basic</li>
              <li>Unlimited AI Lessons</li>
              <li>30 AI podcasts/month</li>
              <li>Remove ads</li>
              <li>20mb file limit</li>
            </ul>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-center text-gray-800">Ultra</h3>
            <p className="text-center text-gray-600">Our most powerful AI for creating professional learning content.</p>
            <p className="text-center text-2xl font-bold text-purple-600">$276/year</p>
            <button
              onClick={() => handlePlanSelection('ultra')}
              className="w-full mt-4 px-6 py-3 text-lg text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Buy Plan
            </button>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>Everything in Premium</li>
              <li>50 AI podcasts/month</li>
              <li>Custom prompts</li>
              <li>Offline mode</li>
              <li>Organization</li>
            </ul>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Best value for your whole school or business. For 10+ users.</p>
          <button
            onClick={() => handlePlanSelection('custom')}
            className="mt-4 px-6 py-3 text-lg text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Get Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanSelection;