import React from 'react';
import ProgressOverviewCard from './ProgressOverviewCard';
import { stats } from '../../constants';
const ProgressOverviewSection = () => {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-4 md:px-0">
      {stats.map((stat) => (
        <ProgressOverviewCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          color={stat.color}
          Icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default ProgressOverviewSection;