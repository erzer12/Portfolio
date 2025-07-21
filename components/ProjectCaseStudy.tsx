import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProjectCaseStudyProps {
  projectId: string;
  onBack: () => void;
}

interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  role: string;
  team: string;
  overview: string;
  problemStatement: {
    title: string;
    description: string;
    challenges: string[];
    goals: string[];
  };
  process: {
    title: string;
    description: string;
    phases: Array<{
      name: string;
      description: string;
      duration: string;
      activities: string[];
    }>;
  };
  solution: {
    title: string;
    description: string;
    keyFeatures: Array<{
      title: string;
      description: string;
      impact: string;
    }>;
    architecture: string;
  };
  technologies: Array<{
    category: string;
    items: string[];
  }>;
  screenshots: Array<{
    url: string;
    title: string;
    description: string;
  }>;
  outcome: {
    title: string;
    description: string;
    metrics: Array<{
      label: string;
      value: string;
      improvement?: string;
    }>;
    impact: string[];
    learnings: string[];
  };
  links: {
    demo?: string;
    github?: string;
    documentation?: string;
  };
}

export function ProjectCaseStudy({ projectId, onBack }: ProjectCaseStudyProps) {
  // Mock data - in a real app, this would come from an API or database
  const projectsData: Record<string, ProjectData> = {
    'neural-vision': {
      id: 'neural-vision',
      title: 'Neural Vision Classifier',
      subtitle: 'Advanced Deep Learning for Medical Image Analysis',
      category: 'Computer Vision',
      duration: '6 months',
      role: 'ML Engineer & Researcher',
      team: '4 developers, 2 researchers',
      overview: 'An advanced deep learning model for real-time object detection and classification using custom CNN architecture, specifically designed for medical imaging applications.',
      problemStatement: {
        title: 'The Challenge',
        description: 'Medical professionals needed a reliable, fast, and accurate system to detect and classify anomalies in medical imaging data. Existing solutions were slow, expensive, and often required extensive manual review.',
        challenges: [
          'Low accuracy rates with existing commercial solutions (73%)',
          'Processing time of 2-3 minutes per image was too slow for clinical workflows',
          'High false positive rates leading to unnecessary procedures',
          'Limited availability of annotated medical imaging datasets',
          'Need for real-time processing in critical care scenarios'
        ],
        goals: [
          'Achieve >90% accuracy in anomaly detection',
          'Reduce processing time to under 30 seconds per image',
          'Minimize false positives by 50%',
          'Create a scalable solution for multiple imaging modalities',
          'Ensure compliance with medical data privacy regulations'
        ]
      },
      process: {
        title: 'Development Process',
        description: 'We followed an iterative approach combining research, development, and clinical validation to ensure the solution met real-world medical requirements.',
        phases: [
          {
            name: 'Research & Data Collection',
            description: 'Comprehensive analysis of existing solutions and dataset preparation',
            duration: '6 weeks',
            activities: [
              'Literature review of SOTA computer vision models',
              'Partnership with medical institutions for data access',
              'Dataset curation and annotation with medical experts',
              'Ethical approval and compliance framework setup'
            ]
          },
          {
            name: 'Model Development',
            description: 'Custom CNN architecture design and training',
            duration: '8 weeks',
            activities: [
              'Custom CNN architecture design with attention mechanisms',
              'Data augmentation strategies for medical images',
              'Transfer learning from pre-trained models',
              'Hyperparameter optimization using Bayesian methods'
            ]
          },
          {
            name: 'Validation & Optimization',
            description: 'Clinical validation and performance optimization',
            duration: '6 weeks',
            activities: [
              'Clinical validation with radiologists',
              'Model optimization for inference speed',
              'Cross-validation across different imaging equipment',
              'Performance benchmarking against commercial solutions'
            ]
          },
          {
            name: 'Deployment & Integration',
            description: 'Production deployment and system integration',
            duration: '4 weeks',
            activities: [
              'API development for clinical system integration',
              'Docker containerization for scalable deployment',
              'Real-time monitoring and alerting system',
              'User training and documentation'
            ]
          }
        ]
      },
      solution: {
        title: 'Technical Solution',
        description: 'We developed a custom CNN architecture with attention mechanisms, optimized for medical imaging analysis with real-time processing capabilities.',
        keyFeatures: [
          {
            title: 'Custom CNN Architecture',
            description: 'Designed specifically for medical imaging with attention mechanisms for focus on relevant regions',
            impact: '15% accuracy improvement over standard architectures'
          },
          {
            title: 'Real-time Processing',
            description: 'Optimized inference pipeline capable of processing images in under 30 seconds',
            impact: '6x faster than previous solutions'
          },
          {
            title: 'Multi-modal Support',
            description: 'Support for various imaging modalities including X-ray, CT, and MRI',
            impact: 'Unified solution across different medical equipment'
          },
          {
            title: 'Confidence Scoring',
            description: 'Provides confidence scores and uncertainty estimates for clinical decision support',
            impact: 'Reduced false positive rate by 45%'
          }
        ],
        architecture: 'The solution uses a hybrid architecture combining ResNet backbone with custom attention modules, deployed as microservices with automatic scaling capabilities.'
      },
      technologies: [
        {
          category: 'Machine Learning',
          items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'Albumentations']
        },
        {
          category: 'Backend',
          items: ['FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Docker']
        },
        {
          category: 'Infrastructure',
          items: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'Kubernetes', 'Terraform']
        },
        {
          category: 'Monitoring',
          items: ['Prometheus', 'Grafana', 'MLflow', 'Weights & Biases', 'Sentry']
        }
      ],
      screenshots: [
        {
          url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
          title: 'Main Dashboard Interface',
          description: 'Clean, intuitive interface for radiologists to upload and analyze medical images'
        },
        {
          url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
          title: 'Analysis Results View',
          description: 'Detailed analysis results with confidence scores and highlighted regions of interest'
        },
        {
          url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop',
          title: 'Performance Metrics Dashboard',
          description: 'Real-time monitoring of model performance and system health metrics'
        }
      ],
      outcome: {
        title: 'Results & Impact',
        description: 'The Neural Vision Classifier exceeded all initial goals and is now deployed in 5 medical facilities, processing over 1000 images daily.',
        metrics: [
          { label: 'Accuracy', value: '94.2%', improvement: '+21% vs baseline' },
          { label: 'Processing Time', value: '28 seconds', improvement: '6x faster' },
          { label: 'False Positive Rate', value: '3.1%', improvement: '-45% reduction' },
          { label: 'Daily Images Processed', value: '1,000+', improvement: 'New capability' }
        ],
        impact: [
          'Reduced diagnostic time from 15 minutes to 2 minutes per case',
          'Improved early detection rate of critical conditions by 35%',
          'Decreased unnecessary follow-up procedures by 40%',
          'Enhanced radiologist confidence in decision-making',
          'Potential for deployment across 50+ additional facilities'
        ],
        learnings: [
          'Importance of domain expert collaboration in medical AI',
          'Value of uncertainty quantification in clinical applications',
          'Need for continuous model monitoring in production',
          'Critical role of data quality in model performance'
        ]
      },
      links: {
        demo: 'https://neural-vision-demo.example.com',
        github: 'https://github.com/username/neural-vision',
        documentation: 'https://docs.neural-vision.example.com'
      }
    },
    'ai-code-assistant': {
      id: 'ai-code-assistant',
      title: 'AI Code Assistant',
      subtitle: 'Intelligent Development Companion',
      category: 'Natural Language Processing',
      duration: '4 months',
      role: 'Full Stack AI Engineer',
      team: '3 developers, 1 designer',
      overview: 'An intelligent coding companion that understands context and provides smart suggestions, built with transformer architecture and trained on massive code repositories.',
      problemStatement: {
        title: 'Developer Productivity Challenge',
        description: 'Developers spend significant time searching for code examples, debugging, and writing boilerplate code. Existing tools lack context awareness and provide generic suggestions.',
        challenges: [
          'Context-unaware code suggestions from existing tools',
          'Time spent on repetitive coding tasks (30% of development time)',
          'Difficulty finding relevant code examples for specific use cases',
          'Language-specific limitations in existing assistants',
          'Poor integration with existing development workflows'
        ],
        goals: [
          'Reduce coding time by 40% through intelligent suggestions',
          'Provide context-aware recommendations',
          'Support 10+ programming languages',
          'Integrate seamlessly with popular IDEs',
          'Achieve 85%+ suggestion acceptance rate'
        ]
      },
      process: {
        title: 'Development Methodology',
        description: 'Agile development approach with continuous user feedback and iterative model improvements.',
        phases: [
          {
            name: 'Data Collection & Preprocessing',
            description: 'Large-scale code repository analysis and data preparation',
            duration: '4 weeks',
            activities: [
              'GitHub repository mining and filtering',
              'Code quality assessment and cleaning',
              'Multi-language tokenization strategies',
              'Context window optimization for transformers'
            ]
          },
          {
            name: 'Model Training & Fine-tuning',
            description: 'Transformer model training and language-specific optimization',
            duration: '6 weeks',
            activities: [
              'Base transformer model selection and adaptation',
              'Language-specific fine-tuning procedures',
              'Context-aware training data generation',
              'Model compression for real-time inference'
            ]
          },
          {
            name: 'IDE Integration Development',
            description: 'Plugin development for major development environments',
            duration: '4 weeks',
            activities: [
              'VS Code extension development',
              'IntelliJ IDEA plugin creation',
              'Vim/Neovim integration',
              'Real-time suggestion API development'
            ]
          },
          {
            name: 'Beta Testing & Refinement',
            description: 'Community testing and iterative improvements',
            duration: '2 weeks',
            activities: [
              'Developer community beta program',
              'Usage analytics and feedback collection',
              'Model performance optimization',
              'User experience refinements'
            ]
          }
        ]
      },
      solution: {
        title: 'AI-Powered Development Platform',
        description: 'A comprehensive AI assistant that provides intelligent code suggestions, explains complex code, and helps with debugging across multiple programming languages.',
        keyFeatures: [
          {
            title: 'Context-Aware Suggestions',
            description: 'Understanding of project context, coding patterns, and developer intent for relevant suggestions',
            impact: '89% suggestion acceptance rate'
          },
          {
            title: 'Multi-Language Support',
            description: 'Support for 12 programming languages with language-specific optimizations',
            impact: 'Covers 95% of developer use cases'
          },
          {
            title: 'Code Explanation',
            description: 'Natural language explanations of complex code snippets and algorithms',
            impact: '60% faster code comprehension'
          },
          {
            title: 'Debugging Assistant',
            description: 'AI-powered error detection and solution suggestions',
            impact: '45% reduction in debugging time'
          }
        ],
        architecture: 'Microservices architecture with transformer models served via GPU-accelerated inference servers, integrated with popular IDEs through lightweight plugins.'
      },
      technologies: [
        {
          category: 'AI/ML',
          items: ['Transformers', 'Hugging Face', 'PyTorch', 'ONNX', 'TensorRT']
        },
        {
          category: 'Backend',
          items: ['FastAPI', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes']
        },
        {
          category: 'Frontend',
          items: ['TypeScript', 'React', 'Electron', 'WebSockets', 'Monaco Editor']
        },
        {
          category: 'DevOps',
          items: ['AWS', 'GitHub Actions', 'Prometheus', 'Grafana', 'Sentry']
        }
      ],
      screenshots: [
        {
          url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
          title: 'IDE Integration',
          description: 'Seamless integration with VS Code showing real-time code suggestions'
        },
        {
          url: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop',
          title: 'Code Explanation Feature',
          description: 'Natural language explanations of complex algorithms and code patterns'
        },
        {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
          title: 'Analytics Dashboard',
          description: 'Usage analytics showing productivity improvements and suggestion accuracy'
        }
      ],
      outcome: {
        title: 'Impact & Adoption',
        description: 'The AI Code Assistant has been adopted by over 500 developers and demonstrates significant productivity improvements across various programming languages.',
        metrics: [
          { label: 'Active Users', value: '500+', improvement: 'Growing 20% monthly' },
          { label: 'Suggestion Accuracy', value: '89%', improvement: '+24% vs baseline' },
          { label: 'Time Saved', value: '40%', improvement: 'Average per developer' },
          { label: 'Languages Supported', value: '12', improvement: '3x more than planned' }
        ],
        impact: [
          'Reduced time spent on boilerplate code by 50%',
          'Improved code quality through intelligent suggestions',
          'Accelerated onboarding of new developers',
          'Enhanced debugging efficiency by 45%',
          'Positive feedback from 94% of beta users'
        ],
        learnings: [
          'Importance of context window optimization for code understanding',
          'Value of language-specific model fine-tuning',
          'Need for real-time performance in development tools',
          'Critical role of developer experience in AI tool adoption'
        ]
      },
      links: {
        demo: 'https://ai-assistant-demo.example.com',
        github: 'https://github.com/username/ai-code-assistant',
        documentation: 'https://docs.ai-assistant.example.com'
      }
    }
  };

  const project = projectsData[projectId];

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-cyber pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-foreground mb-4">Project Not Found</h1>
          <Button onClick={onBack} className="bg-neon-blue text-primary-foreground">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cyber pt-24">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-8 text-muted-foreground hover:text-neon-blue transition-colors duration-200"
          >
            ← Back to Projects
          </Button>
          
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <Badge className="bg-neon-green/20 text-neon-green mb-4">
                {project.category}
              </Badge>
              <h1 className="text-5xl text-foreground mb-4 leading-tight">
                {project.title}
              </h1>
              <h2 className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {project.subtitle}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8">
            <div>
              <h3 className="text-sm font-mono text-neon-blue mb-2">DURATION</h3>
              <p className="text-foreground">{project.duration}</p>
            </div>
            <div>
              <h3 className="text-sm font-mono text-neon-blue mb-2">ROLE</h3>
              <p className="text-foreground">{project.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-mono text-neon-blue mb-2">TEAM</h3>
              <p className="text-foreground">{project.team}</p>
            </div>
          </div>
        </motion.div>

        {/* Overview */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-20"
        >
          <h2 className="text-3xl text-foreground mb-8">Overview</h2>
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {project.overview}
            </p>
          </div>
        </motion.section>

        {/* Problem Statement */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-20"
        >
          <h2 className="text-3xl text-foreground mb-8">{project.problemStatement.title}</h2>
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 space-y-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {project.problemStatement.description}
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl text-neon-blue mb-4">Key Challenges</h3>
                <ul className="space-y-3">
                  {project.problemStatement.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl text-neon-green mb-4">Project Goals</h3>
                <ul className="space-y-3">
                  {project.problemStatement.goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Process */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-20"
        >
          <h2 className="text-3xl text-foreground mb-8">{project.process.title}</h2>
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 space-y-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {project.process.description}
            </p>
            
            <div className="space-y-6">
              {project.process.phases.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border border-border rounded-lg p-6 hover:border-neon-blue/30 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl text-foreground">{phase.name}</h3>
                    <Badge variant="outline" className="text-neon-blue border-neon-blue/30">
                      {phase.duration}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{phase.description}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {phase.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{activity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Solution */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-20"
        >
          <h2 className="text-3xl text-foreground mb-8">{project.solution.title}</h2>
          <div className="space-y-8">
            <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {project.solution.description}
              </p>
              <p className="text-sm text-muted-foreground font-mono bg-secondary/50 p-4 rounded-lg">
                {project.solution.architecture}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {project.solution.keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 hover-lift hover:border-neon-green/30 transition-all duration-300"
                >
                  <h3 className="text-lg text-neon-green mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="text-sm font-mono text-neon-blue bg-neon-blue/10 px-3 py-2 rounded">
                    {feature.impact}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Technologies */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-20"
        >
          <h2 className="text-3xl text-foreground mb-8">Technologies Used</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {project.technologies.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6"
              >
                <h3 className="text-lg text-neon-blue mb-4 font-mono">{category.category}</h3>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <Badge
                      key={itemIndex}
                      variant="secondary"
                      className="mr-2 mb-2 text-xs"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Screenshots */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-20"
        >
          <h2 className="text-3xl text-foreground mb-8">Screenshots</h2>
          <div className="space-y-8">
            {project.screenshots.map((screenshot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-card/30 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover-lift"
              >
                <ImageWithFallback
                  src={screenshot.url}
                  alt={screenshot.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg text-foreground mb-2">{screenshot.title}</h3>
                  <p className="text-muted-foreground">{screenshot.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Outcome */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-20"
        >
          <h2 className="text-3xl text-foreground mb-8">{project.outcome.title}</h2>
          <div className="space-y-8">
            <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {project.outcome.description}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.outcome.metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 text-center hover-lift hover:border-neon-blue/30 transition-all duration-300"
                >
                  <div className="text-2xl font-mono text-neon-blue mb-2">{metric.value}</div>
                  <div className="text-foreground font-medium mb-2">{metric.label}</div>
                  {metric.improvement && (
                    <div className="text-sm text-neon-green">{metric.improvement}</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Impact & Learnings */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6">
                <h3 className="text-xl text-neon-green mb-4">Project Impact</h3>
                <ul className="space-y-3">
                  {project.outcome.impact.map((impact, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6">
                <h3 className="text-xl text-neon-blue mb-4">Key Learnings</h3>
                <ul className="space-y-3">
                  {project.outcome.learnings.map((learning, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{learning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Project Links */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="mb-20"
        >
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 text-center">
            <h3 className="text-xl text-foreground mb-6">Explore This Project</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {project.links.demo && (
                <Button
                  onClick={() => window.open(project.links.demo, '_blank')}
                  className="bg-neon-blue text-primary-foreground hover:bg-neon-blue/90 hover:scale-105 transition-all duration-300"
                >
                  Live Demo
                </Button>
              )}
              {project.links.github && (
                <Button
                  onClick={() => window.open(project.links.github, '_blank')}
                  variant="outline"
                  className="border-neon-green text-neon-green hover:bg-neon-green hover:text-accent-foreground hover:scale-105 transition-all duration-300"
                >
                  View Code
                </Button>
              )}
              {project.links.documentation && (
                <Button
                  onClick={() => window.open(project.links.documentation, '_blank')}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300"
                >
                  Documentation
                </Button>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}