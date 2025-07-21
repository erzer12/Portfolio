import React from 'react';
import { motion } from 'framer-motion';

export function SkillsPage() {
  const skillCategories = [
    {
      title: 'AI & Machine Learning',
      icon: '🧠',
      color: 'neon-blue',
      skills: [
        { name: 'Machine Learning', level: 90, icon: '🤖' },
        { name: 'Deep Learning', level: 85, icon: '🧬' },
        { name: 'Computer Vision', level: 80, icon: '👁️' },
        { name: 'Natural Language Processing', level: 75, icon: '💬' },
        { name: 'Reinforcement Learning', level: 70, icon: '🎯' }
      ]
    },
    {
      title: 'Frontend Development',
      icon: '💻',
      color: 'neon-green',
      skills: [
        { name: 'React', level: 95, icon: '⚛️' },
        { name: 'TypeScript', level: 90, icon: '📘' },
        { name: 'Next.js', level: 85, icon: '🔺' },
        { name: 'Tailwind CSS', level: 90, icon: '🎨' },
        { name: 'Framer Motion', level: 80, icon: '✨' }
      ]
    },
    {
      title: 'Backend Development',
      icon: '⚙️',
      color: 'neon-blue',
      skills: [
        { name: 'Python', level: 95, icon: '🐍' },
        { name: 'Node.js', level: 85, icon: '🟢' },
        { name: 'FastAPI', level: 90, icon: '⚡' },
        { name: 'PostgreSQL', level: 80, icon: '🐘' },
        { name: 'GraphQL', level: 75, icon: '📊' }
      ]
    },
    {
      title: 'Tools & Technologies',
      icon: '🛠️',
      color: 'neon-green',
      skills: [
        { name: 'Git', level: 90, icon: '📝' },
        { name: 'Docker', level: 80, icon: '🐳' },
        { name: 'AWS', level: 75, icon: '☁️' },
        { name: 'Jupyter', level: 85, icon: '📓' },
        { name: 'Linux', level: 80, icon: '🐧' }
      ]
    }
  ];

  const certifications = [
    {
      name: 'AWS Machine Learning Specialty',
      issuer: 'Amazon Web Services',
      year: '2024',
      status: 'completed',
      icon: '🏆'
    },
    {
      name: 'TensorFlow Developer Certificate',
      issuer: 'Google',
      year: '2023',
      status: 'completed',
      icon: '🥇'
    },
    {
      name: 'Deep Learning Specialization',
      issuer: 'Coursera',
      year: '2023',
      status: 'completed',
      icon: '📜'
    },
    {
      name: 'MLOps Engineering',
      issuer: 'Udacity',
      year: '2024',
      status: 'in-progress',
      icon: '⏳'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-cyber pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="font-mono text-neon-green text-sm mb-4">&gt; SKILLS_MATRIX.json</div>
          <h1 className="text-5xl font-light text-foreground mb-6">
            Technical Expertise
          </h1>
          <div className="border-gradient w-24 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills, frameworks, and certifications 
            in AI, software development, and emerging technologies.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 hover-lift hover-glow hover:border-neon-blue/30 transition-all duration-500 group"
            >
              <div className="flex items-center gap-4 mb-8">
                <motion.div 
                  className="text-4xl group-hover:animate-bounce"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  {category.icon}
                </motion.div>
                <div>
                  <h2 className="text-2xl text-foreground group-hover:text-neon-blue transition-colors duration-300">
                    {category.title}
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-neon-blue to-neon-green rounded-full mt-2" />
                </div>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: (categoryIndex * 0.1) + (skillIndex * 0.1) 
                    }}
                    viewport={{ once: true }}
                    className="group/skill"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg group-hover/skill:animate-pulse">{skill.icon}</span>
                        <span className="text-muted-foreground group-hover/skill:text-foreground transition-colors duration-200">
                          {skill.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-neon-blue text-sm">{skill.level}%</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                i < Math.floor(skill.level / 20)
                                  ? 'bg-neon-green shadow-sm'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ 
                          duration: 1, 
                          delay: (categoryIndex * 0.1) + (skillIndex * 0.1) + 0.3,
                          ease: "easeOut"
                        }}
                        viewport={{ once: true }}
                        className="h-2 skill-bar relative"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl text-center text-foreground mb-12">Certifications & Learning</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 hover-lift hover:border-neon-green/30 transition-all duration-300 group cursor-pointer"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:animate-spin">{cert.icon}</span>
                    <div>
                      <h3 className="text-foreground font-medium group-hover:text-neon-green transition-colors duration-200">
                        {cert.name}
                      </h3>
                      <p className="text-neon-blue text-sm">{cert.issuer}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 ${
                    cert.status === 'completed' 
                      ? 'bg-neon-green/20 text-neon-green' 
                      : 'bg-neon-blue/20 text-neon-blue'
                  }`}>
                    <span>{cert.status === 'completed' ? '✓' : '⏳'}</span>
                    <span>{cert.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">{cert.year}</p>
                  {cert.status === 'completed' && (
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-12 max-w-4xl mx-auto hover-lift hover:border-neon-blue/30 transition-all duration-500 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-4xl mb-6 inline-block group-hover:animate-float"
            >
              🚀
            </motion.div>
            <h2 className="text-2xl text-neon-green mb-6 group-hover:text-neon-blue transition-colors duration-300">
              Continuous Learning
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              "The field of AI evolves rapidly, and staying current requires constant learning. 
              I dedicate time daily to reading research papers, experimenting with new models, 
              and contributing to open-source projects. Every challenge is an opportunity to grow."
            </p>
            <div className="flex items-center justify-center gap-4 font-mono text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                LEARNING_MODE: ON
              </div>
              <div className="border-gradient w-16" />
              <div>GROWTH_RATE: ∞</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}