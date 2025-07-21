import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProjectsPageProps {
  onProjectSelect: (projectId: string) => void;
}

export function ProjectsPage({ onProjectSelect }: ProjectsPageProps) {
  const projects = [
    {
      id: 'neural-vision',
      title: 'Neural Vision Classifier',
      category: 'Computer Vision',
      description: 'Advanced deep learning model for real-time object detection and classification using custom CNN architecture. Achieved 94% accuracy on medical imaging datasets.',
      technologies: ['Python', 'PyTorch', 'OpenCV', 'CUDA'],
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop',
      github: 'https://github.com/username/neural-vision',
      demo: 'https://demo.example.com',
      featured: true,
      metrics: { accuracy: '94%', speed: '30ms', dataset: '10K+' }
    },
    {
      id: 'ai-code-assistant',
      title: 'AI Code Assistant',
      category: 'Natural Language Processing',
      description: 'Intelligent coding companion that understands context and provides smart suggestions. Built with transformer architecture and trained on massive code repositories.',
      technologies: ['Python', 'Transformers', 'FastAPI', 'React'],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
      github: 'https://github.com/username/ai-code-assistant',
      demo: 'https://demo.example.com',
      featured: true,
      metrics: { users: '500+', accuracy: '89%', languages: '12' }
    },
    {
      id: 'quantum-ml',
      title: 'Quantum ML Optimizer',
      category: 'Quantum Computing',
      description: 'Hybrid quantum-classical machine learning optimizer for complex optimization problems. Leverages quantum annealing for enhanced convergence.',
      technologies: ['Qiskit', 'Python', 'NumPy', 'Cirq'],
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
      github: 'https://github.com/username/quantum-ml',
      demo: 'https://demo.example.com',
      featured: false,
      metrics: { speedup: '2.3x', problems: '50+', qubits: '16' }
    },
    {
      id: 'autonomous-nav',
      title: 'Autonomous Navigation AI',
      category: 'Robotics',
      description: 'Real-time path planning and obstacle avoidance system for autonomous vehicles using reinforcement learning and sensor fusion.',
      technologies: ['Python', 'ROS', 'TensorFlow', 'C++'],
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop',
      github: 'https://github.com/username/autonomous-nav',
      demo: 'https://demo.example.com',
      featured: false,
      metrics: { accuracy: '97%', distance: '500km', scenarios: '100+' }
    },
    {
      id: 'smart-city',
      title: 'Smart City Analytics',
      category: 'Data Science',
      description: 'Comprehensive urban data analysis platform using IoT sensors and machine learning to optimize city operations and resource allocation.',
      technologies: ['Python', 'Apache Kafka', 'MongoDB', 'D3.js'],
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
      github: 'https://github.com/username/smart-city',
      demo: 'https://demo.example.com',
      featured: false,
      metrics: { sensors: '1000+', cities: '5', efficiency: '+23%' }
    },
    {
      id: 'blockchain-oracle',
      title: 'Blockchain AI Oracle',
      category: 'Web3',
      description: 'Decentralized oracle network that provides AI predictions and real-world data to smart contracts with cryptographic proof of accuracy.',
      technologies: ['Solidity', 'Node.js', 'IPFS', 'Chainlink'],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
      github: 'https://github.com/username/blockchain-oracle',
      demo: 'https://demo.example.com',
      featured: false,
      metrics: { contracts: '200+', accuracy: '96%', chains: '3' }
    }
  ];

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gradient-cyber pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="font-mono text-neon-green text-sm mb-4">&gt; PROJECTS_PORTFOLIO.exe</div>
          <h1 className="text-5xl font-light text-foreground mb-6">
            Featured Work
          </h1>
          <div className="border-gradient w-24 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my latest AI projects, from computer vision to natural language processing. 
            Each project pushes the boundaries of what's possible with artificial intelligence.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="mb-24">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl text-neon-blue font-mono mb-12"
          >
            &lt;featured /&gt;
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group bg-card/30 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover-lift hover-glow hover:border-neon-blue/50 transition-all duration-500"
              >
                <div className="relative overflow-hidden aspect-video">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-xs font-mono">
                      {project.category}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl text-foreground mb-3 group-hover:text-neon-blue transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-background/30 rounded-lg">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-neon-blue font-mono text-lg">{value}</div>
                        <div className="text-muted-foreground text-xs uppercase">{key}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-secondary/50 text-muted-foreground text-sm rounded-full border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => onProjectSelect(project.id)}
                      className="bg-neon-green text-accent-foreground hover:bg-neon-green/90 hover:scale-105 transition-all duration-300 group/btn"
                    >
                      <span className="group-hover/btn:animate-pulse">Case Study</span>
                    </Button>
                    <Button
                      className="bg-neon-blue text-primary-foreground hover:bg-neon-blue/90 hover:scale-105 transition-all duration-300 group/btn"
                      onClick={() => window.open(project.demo, '_blank')}
                    >
                      <span className="group-hover/btn:animate-pulse">Live Demo</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-border text-muted-foreground hover:bg-background/50 hover:scale-105 transition-all duration-300"
                      onClick={() => window.open(project.github, '_blank')}
                    >
                      Code
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Other Projects */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl text-neon-green font-mono mb-12"
          >
            &lt;more_projects /&gt;
          </motion.h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-card/30 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover-lift hover:border-neon-green/50 transition-all duration-300"
              >
                <div className="relative overflow-hidden aspect-video">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <div className="bg-neon-green/20 text-neon-green px-2 py-1 rounded text-xs font-mono">
                      {project.category}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg text-foreground mb-2 group-hover:text-neon-green transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-background/30 rounded text-center">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-neon-green font-mono text-sm">{value}</div>
                        <div className="text-muted-foreground text-xs">{key}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-secondary/50 text-muted-foreground text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-muted-foreground text-xs">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onProjectSelect(project.id)}
                      className="bg-neon-green text-accent-foreground hover:bg-neon-green/90 flex-1 hover:scale-105 transition-all duration-300"
                    >
                      Case Study
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border text-muted-foreground hover:bg-background/50 hover:scale-105 transition-all duration-300"
                      onClick={() => window.open(project.demo, '_blank')}
                    >
                      Demo
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-12 hover-lift hover:border-neon-blue/30 transition-all duration-500">
            <h2 className="text-2xl text-neon-blue mb-4">Want to Collaborate?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              I'm always excited to work on innovative AI projects that push boundaries and create real impact. 
              Let's build something amazing together.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="bg-neon-blue text-primary-foreground hover:bg-neon-blue/90 px-8 py-3 hover:scale-105 transition-all duration-300 group"
                onClick={() => window.open('mailto:contact@example.com', '_blank')}
              >
                <span className="group-hover:animate-pulse">Start a Project</span>
              </Button>
              <Button
                variant="outline"
                className="border-neon-green text-neon-green hover:bg-neon-green hover:text-accent-foreground px-8 py-3 hover:scale-105 transition-all duration-300 group"
                onClick={() => window.open('https://github.com/username', '_blank')}
              >
                <span className="group-hover:animate-pulse">View All Code</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}