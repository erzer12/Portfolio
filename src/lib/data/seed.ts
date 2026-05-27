import { supabaseAdmin } from '@/lib/supabase/server';

export async function reseedPortfolioData() {
  await supabaseAdmin.from('testimonials').delete();
  await supabaseAdmin.from('footer_links').delete();
  await supabaseAdmin.from('achievements').delete();
  await supabaseAdmin.from('certifications').delete();
  await supabaseAdmin.from('education').delete();
  await supabaseAdmin.from('experience').delete();
  await supabaseAdmin.from('skills').delete();
  await supabaseAdmin.from('projects').delete();
  await supabaseAdmin.from('profile').delete().eq('id', 'main');
  await supabaseAdmin.from('site_settings').delete().eq('id', 'main');

  await supabaseAdmin.from('profile').upsert(
    {
      id: 'main',
      name: 'Harshil P',
      tagline:
        'NASA Space Apps 2025 Global Nominee | Frontend Intern @ GTech MuLearn | Campus Manthri @ GFG | GitHub | Student at College of Engineering Kottarakkara',
      summary:
        'AI and ML-focused Computer Science student with experience in real-time ASL recognition, computer vision, NLP, fine-tuning, and RAG-based mental health assistants. NASA Space Apps 2025 Global Nominee and frontend intern at MuLearn working on a 60k+ user community platform. Proficient in PyTorch, scikit-learn, Hugging Face, Docker, CI/CD, and React/Next.js.',
      location: 'Kerala, India',
      email: 'harshilp1234@gmail.com',
      image:
        'https://hlbmzefstbersvrafzji.supabase.co/storage/v1/object/public/portfolio_media/1778139269275-k8lwj4.jpg',
      resume:
        'https://hlbmzefstbersvrafzji.supabase.co/storage/v1/object/public/portfolio_media/1778125303389-6bz4xb.pdf',
      social: {
        github: 'https://github.com/erzer12',
        linkedin: 'https://www.linkedin.com/in/harshilp1',
      },
    },
    { onConflict: 'id' },
  );

  await supabaseAdmin.from('projects').insert([
    {
      title: 'SignStream - Real-Time Browser-Based Sign Language Recognition',
      slug: 'signstream',
      description:
        'Client-side real-time sign language recognition (SRL) with MediaPipe landmarks, SignGRU, and ONNX - plus personal fine-tuning.',
      long_description: null,
      image: null,
      tags: ['Jupyter Notebook', 'PyTorch', 'GRU', 'MediaPipe', 'ONNX Runtime Web', 'NLP', 'JavaScript'],
      github: null,
      live: null,
      category: null,
      date: 'Mar 2026',
      featured: true,
      order: 0,
    },
    {
      title: 'Historical Risk Explorer - NASA Space Apps 2025',
      slug: 'historical-risk-explorer',
      description:
        'A Streamlit-based tool developed for the NASA Earth Observation Challenge, enabling users to analyze historical environmental data and assess risk probabilities through interactive visualizations.',
      long_description: null,
      image: null,
      tags: ['Python', 'Streamlit', 'Geospatial Analysis', 'Data Visualization'],
      github: null,
      live: null,
      category: null,
      date: 'Oct 2025',
      featured: true,
      order: 1,
    },
    {
      title: 'Zen - AI Mental Health Companion',
      slug: 'zen',
      description:
        'An AI-powered mental health support chatbot for students. Zen combines emotion detection, RAG-powered knowledge retrieval, and interactive wellness tools to provide personalized, empathetic support.',
      long_description: null,
      image: null,
      tags: ['PyTorch', 'Hugging Face', 'FAISS', 'Sentence Transformers', 'RAG', 'Gradio', 'Llama3'],
      github: null,
      live: null,
      category: null,
      date: 'Jan 2026',
      featured: true,
      order: 2,
    },
  ]);

  await supabaseAdmin.from('skills').insert([
    { category: 'Languages', skills: ['Python', 'JavaScript', 'TypeScript'], order: 0 },
    {
      category: 'Machine Learning',
      skills: ['Scikit-learn', 'Pandas', 'NumPy', 'NLP', 'Computer Vision', 'Feature Engineering', 'Model Evaluation'],
      order: 1,
    },
    { category: 'Web and Application Dev', skills: ['REST APIs', 'Flask', 'React', 'Next.js', 'Gradio', 'Streamlit'], order: 2 },
    {
      category: 'Deep Learning',
      skills: ['PyTorch', 'TensorFlow', 'RNN/GRU', 'Transformers', 'Model Deployment', 'Inference Optimization'],
      order: 3,
    },
    {
      category: 'Generative AI',
      skills: ['Hugging Face Transformers', 'RAG', 'FAISS', 'Sentence Transformers', 'Fine-tuning', 'Prompt Engineering', 'LLM APIs'],
      order: 4,
    },
    { category: 'Databases and Platforms', skills: ['MongoDB', 'PostgreSQL', 'Firebase', 'Vercel', 'Render', 'Jupyter'], order: 5 },
    { category: 'Tools and Libraries', skills: ['Git', 'MediaPipe', 'ONNX Runtime', 'TanStack Query', 'Zustand', 'Tailwind CSS'], order: 6 },
  ]);

  await supabaseAdmin.from('experience').insert([
    {
      company: 'MuLearn Foundation',
      role: 'Frontend Intern',
      employment_type: 'Hybrid',
      start_date: 'Jan 2026',
      end_date: 'June 2026',
      description: '',
      bullets: [
        'Built responsive frontend features for the MuLearn dashboard using Next.js and React, serving 60,000+ users across the developer community.',
        'Developed reusable UI components with Tailwind CSS and Zustand, establishing a scalable state management architecture across the application.',
        'Integrated RESTful APIs via TanStack Query, reducing load times by 30% and improving data caching efficiency.',
      ],
      tags: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Zustand', 'TanStack Query'],
      certificate_url: null,
      recommendation_url: null,
      repo_url: null,
      related_projects: [],
      order: 0,
    },
    {
      company: 'GeeksforGeeks',
      role: 'Campus Manthri',
      employment_type: 'Hybrid',
      start_date: 'Jan 2026',
      end_date: 'June 2026',
      description: '',
      bullets: [
        'Organized a Campus Awareness Drive reaching 200+ students, promoting competitive programming and growing campus participation in coding contests.',
      ],
      tags: ['Leadership', 'Communication Skills', 'Event Coordination', 'Community Management', 'Team Collaboration'],
      certificate_url: null,
      recommendation_url: 'https://drive.google.com/file/d/1PJKXCFVBAHIPTnlXYEgLeKA3sdHhOIr3/view?usp=sharing',
      repo_url: null,
      related_projects: [],
      order: 1,
    },
    {
      company: 'Inovus Labs',
      role: 'Open Source',
      employment_type: null,
      start_date: 'Oct 2025 - Hacktoberfest',
      end_date: null,
      description: '',
      bullets: [
        'Developed configurable themes and optimized core SDK behavior for Festive.js, a lightweight JavaScript library for dynamic seasonal website overlays.',
        'Merged multiple PRs collaborating with maintainers; recognized as Top Contributor in the MuLearn Community during Hacktoberfest 2025.',
      ],
      tags: ['JavaScript', 'HTML'],
      certificate_url: null,
      recommendation_url: null,
      repo_url: null,
      related_projects: [],
      order: 2,
    },
  ]);

  await supabaseAdmin.from('education').insert([
    { school: 'College of Engineering Kottarakkara', degree: 'B.Tech Computer Science (AI & ML)', year: '2023-2027', description: '7.77 CGPA', order: 0 },
    { school: "Bhavan's Vidya Mandir", degree: 'Class 12', year: '2023', description: '90.4%', order: 1 },
  ]);

  await supabaseAdmin.from('certifications').insert([
    {
      name: 'IBM AI Developer Professional Certificate',
      issuer: 'IBM',
      date: 'Jan 2026',
      link: 'https://coursera.org/share/8b00a0b8d0db0465b3047cb19bacfc71',
      image: null,
      credly_id: null,
      order: 0,
    },
    {
      name: 'Python MOOC',
      issuer: 'University of Helsinki',
      date: 'Mar 2025',
      link: 'https://certificates.mooc.fi/validate/gyrec0pjnl',
      image: null,
      credly_id: null,
      order: 1,
    },
    {
      name: 'AWS Generative AI and AI Agents with Amazon Bedrock',
      issuer: 'AWS',
      date: 'Jan 2026',
      link: 'https://coursera.org/share/4e12ea798bfebd6dd460c154a9dcc8d4',
      image: null,
      credly_id: null,
      order: 2,
    },
  ]);

  await supabaseAdmin.from('site_settings').upsert({ id: 'main', show_testimonials: true }, { onConflict: 'id' });

  await supabaseAdmin.from('footer_links').insert([
    { category: 'Professional', label: 'LinkedIn', url: 'https://linkedin.com/in/harshilp1', order: 0 },
    { category: 'Professional', label: 'Credly', url: 'https://www.credly.com/users/harshilp/', order: 1 },
    { category: 'Coding', label: 'GitHub', url: 'https://github.com/erzer12', order: 2 },
    { category: 'Coding', label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/profile/harshilp07', order: 3 },
    { category: 'Coding', label: 'HackerRank', url: 'https://www.hackerrank.com/profile/erzer', order: 4 },
    { category: 'Coding', label: 'LeetCode', url: 'https://leetcode.com/u/erzer12/', order: 5 },
    { category: 'AI & ML', label: 'Kaggle', url: 'https://www.kaggle.com/erzer12', order: 6 },
    { category: 'AI & ML', label: 'Hugging Face', url: 'https://huggingface.co/Erzer12', order: 7 },
  ]);
}