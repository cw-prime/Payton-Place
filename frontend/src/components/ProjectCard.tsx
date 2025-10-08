import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const getImageUrl = (imagePath: string) => {
    // If already a full URL (http/https), return as-is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend API base URL
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <Link to={`/projects/${project._id}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={getImageUrl(project.images[0])}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{project.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
