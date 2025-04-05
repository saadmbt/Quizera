import React from 'react'
import GroupCard from './GroupCard';

function ListGroups({groups, searchQuery}) {
  // Filter groups based on the search query
const filteredGroups = (groups || []).filter((group) =>
    (group.name || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );
  
  
    if (filteredGroups.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No groups found</p>
        </div>
      );
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group,index) => (
          <GroupCard key={index} group={group} />
        ))}
      </div>
    );
}

export default ListGroups