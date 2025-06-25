import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  UserCircleIcon, 
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import ProfileSettings from './profileSettings';
import SecuritySettings from './securitySettings';

const Settings = ({ userType = 'professor' }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: 'Profile', icon: UserCircleIcon, component: ProfileSettings },
    { name: 'Security', icon: ShieldCheckIcon, component: SecuritySettings },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile and account security
          </p>
        </div>

        <div className="p-6">
          <Tab.Group onChange={setSelectedTab}>
            <div className="flex flex-col md:flex-row gap-8">
              <Tab.List className="flex flex-col space-y-1 w-full md:w-64">
                {tabs.map((tab, index) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      clsx(
                        'flex items-center px-4 py-3 text-sm font-medium rounded-lg',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                        selected
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )
                    }
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="flex-1">
                {tabs.map((tab, index) => (
                  <Tab.Panel
                    key={index}
                    className={clsx(
                      'rounded-lg bg-white',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    )}
                  >
                    <tab.component userType={userType} />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </div>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default Settings;