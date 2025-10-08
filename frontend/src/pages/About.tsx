import { useEffect, useState } from 'react';
import { Home, Hammer, Users2 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import TeamCard from '../components/TeamCard';
import SectionHeading from '../components/SectionHeading';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTeamMembers } from '../services/api';
import type { TeamMember } from '../types';

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await getTeamMembers();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const coreValues = [
    {
      icon: Home,
      title: 'Quality',
      description: 'We are committed to the highest standards of craftsmanship and attention to detail in every project.',
    },
    {
      icon: Hammer,
      title: 'Integrity',
      description: 'We conduct our business with honesty, transparency, and ethical practices.',
    },
    {
      icon: Users2,
      title: 'Collaboration',
      description: 'We foster a collaborative environment, working closely with clients, partners, and our team to achieve shared goals.',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* About Intro */}
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading>About Us</SectionHeading>
          <p className="text-lg text-gray-600 max-w-4xl">
            Payton Place Development is a premier real estate development company specializing in
            transforming properties to meet the evolving needs of our clients. With a rich history of
            successful projects, we bring expertise and innovation to both residential and commercial
            developments.
          </p>
        </div>
      </AnimatedSection>

      {/* Our History */}
      <AnimatedSection className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-6">Our History</h2>
          <p className="text-gray-600 text-lg max-w-4xl">
            Founded in 2005, Payton Place Development began with a vision to create exceptional living
            spaces through thoughtful design and meticulous craftsmanship. Over the years, we have
            expanded our capabilities to include commercial projects, leveraging our experience to deliver
            high-quality developments that enhance communities and provide lasting value.
          </p>
        </div>
      </AnimatedSection>

      {/* Our Team */}
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-6">Our Team</h2>
          <p className="text-gray-600 text-lg mb-12 max-w-4xl">
            Our team comprises seasoned professionals with diverse backgrounds in architecture,
            construction, and project management. We are united by a shared commitment to excellence and
            a passion for creating spaces that inspire and endure.
          </p>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {teamMembers.map((member, index) => (
                <AnimatedSection key={member._id} delay={index * 0.1}>
                  <TeamCard member={member} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Our Mission */}
      <AnimatedSection className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg max-w-4xl">
            To deliver innovative and sustainable real estate developments that exceed client
            expectations and contribute positively to the communities we serve. We strive to create
            spaces that are not only aesthetically pleasing but also functional and enduring.
          </p>
        </div>
      </AnimatedSection>

      {/* Core Values */}
      <AnimatedSection className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <div className="border border-gray-200 rounded-lg p-8">
                  <value.icon className="w-10 h-10 mb-4 text-gray-700" />
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default About;
