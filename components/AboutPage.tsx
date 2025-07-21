import React from 'react';
import { motion } from 'framer-motion';

export function AboutPage() {
  const techStack = [
    { category: 'AI/ML', items: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face'] },
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'] },
    { category: 'Tools', items: ['Git', 'VS Code', 'Jupyter', 'Figma', 'Linear'] }
  ];

  const experiences = [
    {
      period: '2024 - Present',
      title: 'AI Research Intern',
      company: 'TechCorp Labs',
      description: 'Developing neural network architectures for computer vision applications.'
    },
    {
      period: '2023 - 2024',
      title: 'Freelance Developer',
      company: 'Independent',
      description: 'Built AI-powered web applications for startups and small businesses.'
    },
    {
      period: '2022 - 2023',
      title: 'Computer Science Student',
      company: 'University',
      description: 'Focused on machine learning, algorithms, and software engineering principles.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-cyber pt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="font-mono text-neon-green text-sm mb-4">&gt; ABOUT_ME.md</div>
          <h1 className="text-5xl font-light text-white mb-6">
            Who I Am
          </h1>
          <div className="border-gradient w-24 mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h2 className="text-2xl text-neon-blue mb-6">My Journey</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  I'm a passionate developer fascinated by the endless possibilities of artificial intelligence. 
                  My journey began with curiosity about how machines can learn and think, leading me down 
                  the rabbit hole of neural networks and deep learning.
                </p>
                <p>
                  Currently pursuing Computer Science with a focus on AI/ML, I spend my time building 
                  intelligent systems that can understand, learn, and adapt. From computer vision to 
                  natural language processing, I love exploring the cutting edge of technology.
                </p>
                <p>
                  When I'm not coding, you'll find me reading research papers, experimenting with new 
                  AI models, or contributing to open-source projects that push the boundaries of what's possible.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h2 className="text-2xl text-neon-green mb-6">What Drives Me</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Innovation</h3>
                    <p className="text-gray-400 text-sm">Creating solutions that didn't exist before</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Impact</h3>
                    <p className="text-gray-400 text-sm">Building technology that makes a difference</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Learning</h3>
                    <p className="text-gray-400 text-sm">Constantly evolving with the field</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h2 className="text-2xl text-white mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4 font-mono">
                <div>
                  <div className="text-neon-blue text-lg">Age</div>
                  <div className="text-gray-400">22</div>
                </div>
                <div>
                  <div className="text-neon-green text-lg">Location</div>
                  <div className="text-gray-400">San Francisco</div>
                </div>
                <div>
                  <div className="text-neon-blue text-lg">Focus</div>
                  <div className="text-gray-400">AI/ML</div>
                </div>
                <div>
                  <div className="text-neon-green text-lg">Status</div>
                  <div className="text-gray-400">Available</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl text-center text-white mb-12">Tech Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack, index) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-neon-blue/30 transition-all duration-300"
              >
                <h3 className="text-neon-blue font-mono text-lg mb-4">{stack.category}</h3>
                <div className="space-y-2">
                  {stack.items.map((item, itemIndex) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (index * 0.1) + (itemIndex * 0.05) }}
                      viewport={{ once: true }}
                      className="text-gray-300 text-sm hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl text-center text-white mb-12">Experience</h2>
          <div className="max-w-3xl mx-auto">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative pl-8 pb-12 last:pb-0"
              >
                <div className="absolute left-0 top-0 w-4 h-4 bg-neon-green rounded-full" />
                {index < experiences.length - 1 && (
                  <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-white/10" />
                )}
                <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 ml-6">
                  <div className="font-mono text-neon-blue text-sm mb-2">{exp.period}</div>
                  <h3 className="text-xl text-white mb-1">{exp.title}</h3>
                  <div className="text-neon-green mb-3">{exp.company}</div>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}