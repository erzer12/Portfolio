import { Github, Linkedin, Mail, Globe } from 'lucide-react';

export const RESUME_DATA = {
    name: "Harshil P",
    tagline: "Third Year Undergraduate — Computer Science and Engineering (AI & ML)",
    summary: "I write code that works on the first try—eventually. A CS undergrad (AI & ML) building things that make humans and machines happy. From AI bots to full-stack apps, I bridge the gap between complex algorithms and intuitive UIs. Certified in ML & GenAI, and currently teaching machines to understand bad human instructions.",
    location: "Kerala, India",
    contact: {
        email: "harshilp1234@gmail.com",
        phone: "+91-9496848746",
        social: [
            { name: "GitHub", url: "https://github.com/erzer12", icon: Github },
            { name: "LinkedIn", url: "https://www.linkedin.com/in/harshil-p-4a6a3b22a/", icon: Linkedin },
            { name: "Website", url: "https://harshilp.codes", icon: Globe },
            { name: "Email", url: "mailto:harshilp1234@gmail.com", icon: Mail },
        ],
    },
    education: [
        {
            school: "College of Engineering, Kottarakkara",
            degree: "B.Tech - Computer Science (AI & ML)",
            year: "2023-2027",
            grade: "7.91/10",
        },
        {
            school: "Bhavan's Vidya Mandir, Variyapuram",
            degree: "Class 12 - Higher Secondary Education",
            year: "2022-2023",
            grade: "90.4%",
        },
        {
            school: "Bhavan's Vidya Mandir, Variyapuram",
            degree: "Class 10 - Secondary Education",
            year: "2020-2021",
            grade: "91.8%",
        },
    ],
    projects: [
        {
            title: "NewsHunt – Discord Bot",
            date: "May 2025",
            description: "Discord bot providing global news updates with language and country preferences, onboarding, and admin configuration.",
            tech: ["Python", "discord.py", "MongoDB", "Flask", "Render"],
            links: {
                github: "https://github.com/erzer12/NewsHunt-bot",
                demo: "#",
            },
        },
        {
            title: "HR Agent",
            date: "Sept 2025",
            description: "AI-powered web app for resume screening, candidate ranking, and interview scheduling. Automated email notifications.",
            tech: ["Python", "Flask", "GPT Models", "OpenAI API"],
            links: {
                github: "https://github.com/erzer12/hr-agent",
                demo: "#",
            },
        },
        {
            title: "Portfolio Website",
            date: "Aug 2025",
            description: "Personal portfolio website showcasing projects and skills with a minimalist design.",
            tech: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
            links: {
                github: "https://github.com/erzer12/my-portfolio",
                demo: "https://harshilp.codes",
            },
        },
        {
            title: "Historical Risk Explorer",
            date: "Oct 2025",
            description: "Global Nominee for NASA Space Apps Challenge 2025. Streamlit-based visualization tool to analyze environmental data and risk probability.",
            tech: ["Python", "Streamlit", "Data Visualization", "NASA Data"],
            links: {
                github: "https://github.com/erzer12/Nasa-hacthon",
                demo: "#",
            },
        },
    ],
    skills: {
        languages: ["Python", "JavaScript", "TypeScript"],
        frontend: ["React", "Next.js", "Tailwind CSS", "Streamlit"],
        backend: ["Flask", "Firebase", "MongoDB", "PostgreSQL"],
        ai: ["OpenAI/GPT", "API Integration", "Prompt Engineering"],
        tools: ["Git", "GitHub", "Render", "VS Code", "Linux", "Figma"],
    },
    workExperience: [
        {
            company: "Tech Company (Placeholder)",
            role: "Software Engineer Intern",
            date: "Summer 2025",
            description: "Developed scalable web applications using Next.js and TypeScript. Optimized database queries reducing load times by 40%.",
        },
    ],
    certifications: [
        { name: "Python Programming MOOC", issuer: "University of Helsinki", date: "Mar 2025", link: "https://www.credly.com/" },
        { name: "AWS Educate – Machine Learning Foundations", issuer: "Amazon Web Services", date: "Aug 2025", link: "https://www.credly.com/" },
        { name: "AWS Educate – Introduction to Generative AI", issuer: "Amazon Web Services", date: "Aug 2025", link: "https://www.credly.com/" },
        { name: "Artificial Intelligence Fundamentals", issuer: "IBM SkillsBuild", date: "Aug 2025", link: "https://www.credly.com/" },
        { name: "Prompt Design in Vertex AI", issuer: "Google Cloud", date: "May 2025", link: "https://www.credly.com/" },
    ],
};
