'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RESUME_DATA } from '@/data/resume';

// Types
export type Project = {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    github: string;
    live: string;
    aiHint?: string;
    order?: number;
};

export type Skill = {
    id: string;
    title: string;
    icon: string;
    skills: string[];
};

export type Experience = {
    id: string;
    company: string;
    role: string;
    start: string;
    end: string;
    description: string;
    order?: number;
};

export type Certification = {
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
    image?: string;
};

export type Profile = {
    name: string;
    tagline: string;
    summary: string;
    location: string;
    email: string;
    phone: string;
    resume?: string;
    social: {
        github: string;
        linkedin: string;
        website: string;
        email: string; // duplicate for ease
    };
};

// Initial Static States for Instant Render
const STATIC_PROJECTS: Project[] = RESUME_DATA.projects.map((p, i) => ({
    id: `static-${i}`,
    title: p.title,
    description: p.description,
    image: '',
    tags: p.tech,
    github: p.links.github,
    live: p.links.demo,
    order: i
}));

const STATIC_SKILLS: Skill[] = Object.entries(RESUME_DATA.skills).map(([category, items], i) => ({
    id: `static-${i}`,
    title: category.replace('_', ' '),
    icon: 'Code2',
    skills: items
}));

const STATIC_EXPERIENCE: Experience[] = RESUME_DATA.workExperience.map((job, i) => ({
    id: `static-${i}`,
    company: job.company,
    role: job.role,
    start: job.date.split(' - ')[0] || job.date,
    end: job.date.split(' - ')[1] || 'Present',
    description: job.description,
    order: i
}));

const STATIC_CERTS: Certification[] = RESUME_DATA.certifications.map((cert, i) => ({
    id: `static-${i}`,
    name: cert.name,
    issuer: cert.issuer,
    date: cert.date,
    link: cert.link
}));

const STATIC_PROFILE: Profile = {
    name: RESUME_DATA.name,
    tagline: RESUME_DATA.tagline,
    summary: RESUME_DATA.summary,
    location: RESUME_DATA.location,
    email: RESUME_DATA.contact.email,
    phone: RESUME_DATA.contact.phone,
    social: {
        github: RESUME_DATA.contact.social.find(s => s.name === 'GitHub')?.url || '',
        linkedin: RESUME_DATA.contact.social.find(s => s.name === 'LinkedIn')?.url || '',
        website: RESUME_DATA.contact.social.find(s => s.name === 'Website')?.url || '',
        email: RESUME_DATA.contact.social.find(s => s.name === 'Email')?.url || '',
    }
};

// Hooks

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
            setProjects(data);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch projects:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { projects, loading };
}

export function useSkills() {
    const [skills, setSkills] = useState<Skill[]>(STATIC_SKILLS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'skills'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
            setSkills(data);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch skills:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { skills, loading };
}

export function useExperience() {
    const [experience, setExperience] = useState<Experience[]>(STATIC_EXPERIENCE);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'experience'), orderBy('order', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
            setExperience(data);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch experience:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { experience, loading };
}

export function useCertifications() {
    const [certifications, setCertifications] = useState<Certification[]>(STATIC_CERTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'certifications'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certification));
            setCertifications(data);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch certifications:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { certifications, loading };
}

export type Education = {
    id: string;
    school: string;
    degree: string;
    year: string;
    description: string; // Optional description
    order?: number;
};

// ... existing types ...

const STATIC_EDUCATION: Education[] = RESUME_DATA.education.map((edu, i) => ({
    id: `static-${i}`,
    school: edu.school,
    degree: edu.degree,
    year: edu.year,
    description: edu.grade ? `Grade: ${edu.grade}` : '',
    order: i
}));

// ... existing static data ...

export function useEducation() {
    const [education, setEducation] = useState<Education[]>(STATIC_EDUCATION);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'education'), orderBy('order', 'asc')); // or desc
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Education));
            setEducation(data);
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch education:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { education, loading };
}

export function useProfile() {
    const [profile, setProfile] = useState<Profile>(STATIC_PROFILE);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'profile', 'main'), (doc) => {
            if (doc.exists()) {
                setProfile(doc.data() as Profile);
            }
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch profile:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { profile, loading };
}
