import type { TeamMember } from '../types';

interface TeamCardProps {
  member: TeamMember;
}

const TeamCard = ({ member }: TeamCardProps) => {
  return (
    <div className="text-center">
      <div className="mb-4 inline-block">
        <div className="w-48 h-48 rounded-full overflow-hidden mx-auto bg-gray-200">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
      <p className="text-gray-600 text-sm">{member.role}</p>
    </div>
  );
};

export default TeamCard;
