import { Users } from 'lucide-react';

const Members = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1a1a1d] flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Team Members</h2>
      <p className="text-gray-500 dark:text-zinc-400 text-center max-w-md">
        Invite team members to collaborate on your AI receptionist. This feature is coming soon.
      </p>
      <span className="mt-4 px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 text-sm rounded-full">
        Coming Soon
      </span>
    </div>
  );
};

export default Members;
