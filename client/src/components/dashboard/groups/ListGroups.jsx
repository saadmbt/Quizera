import React from 'react'
import GroupCard from '../../dashbord prof/GroupCard';

function ListGroups({ groups, searchQuery }) {
  // Map backend group data to GroupCard props
  const mappedGroups = (groups || []).map(group => ({
    name: group.group_name || '',
    count: group.students ? group.students.length : 0,
    groupId: group._id
  }));

  // Filter groups based on the search query
  const filteredGroups = mappedGroups.filter((group) =>
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
      {filteredGroups.map((group, index) => (
        <GroupCard key={index} name={group.name} count={group.count} groupId={group.groupId} />
      ))}
    </div>
  );
}

export default ListGroups;
