
'use server';

import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export async function sendEmail(formData: z.infer<typeof contactSchema>) {
  const parsedData = contactSchema.safeParse(formData);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.issues.map(issue => issue.message).join(' ');
    return { success: false, message: `Invalid form data: ${errorMessages}` };
  }

  // 1. Save to Firestore
  try {
    const docRef = await adminDb.collection("messages").add({
      ...parsedData.data,
      timestamp: FieldValue.serverTimestamp(),
    });
    if (process.env.NODE_ENV === 'development') console.log("Document written to Firestore with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document to Firestore: ", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to save message to database. Details: ${errorMessage}` };
  }

  // 2. Send email with Resend
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found. Skipping email send. Message was saved to Firestore.");
    // We return success because the primary action (saving the message) worked.
    return { success: true, message: 'Your message has been saved successfully!' };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const emailFrom = process.env.EMAIL_FROM || 'Portfolio Notifier <noreply@harshilp.codes>';
    const emailTo = process.env.EMAIL_TO || 'harshilp1234@gmail.com';

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: [emailTo],
      subject: `New Message from ${parsedData.data.name}`,
      html: `
        <p>You received a new message from your portfolio contact form:</p>
        <p><strong>Name:</strong> ${parsedData.data.name}</p>
        <p><strong>Email:</strong> ${parsedData.data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${parsedData.data.message}</p>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (process.env.NODE_ENV === 'development') console.log("Email sent successfully via Resend:", data);
    return { success: true, message: 'Your message has been sent and saved successfully!' };

  } catch (e) {
    console.error("Error sending email with Resend: ", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    // The message was saved to Firestore, but email failed.
    // We can inform the user, but it's not a total failure.
    return { success: false, message: `Message was saved, but failed to send email notification. Details: ${errorMessage}` };
  }
}

// --- Admin Panel Actions ---

const skillSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  icon: z.string().min(1, 'Icon is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().optional().or(z.literal('')),
  tags: z.union([z.string(), z.array(z.string())]).transform(val => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  }),
  github: z.string().optional().or(z.literal('')),
  live: z.string().optional().or(z.literal('')),
  aiHint: z.string().optional(),
  order: z.number().optional(),
});


export async function saveSkill(formData: z.infer<typeof skillSchema>) {
  // ... (keep existing)
  const parsed = skillSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: 'Invalid skill data.' };
  }
  try {
    const { id, ...skillData } = parsed.data;
    if (id) {
      await adminDb.collection('skills').doc(id).set(skillData, { merge: true });
    } else {
      await adminDb.collection('skills').add(skillData);
    }
    revalidatePath('/');
    return { success: true, message: 'Skill saved successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to save skill: ${errorMessage}` };
  }
}

export async function deleteSkill(id: string) {
  // ... (keep existing)
  try {
    if (!id) throw new Error("Document ID is required for deletion.");
    await adminDb.collection('skills').doc(id).delete();
    revalidatePath('/');
    return { success: true, message: 'Skill deleted successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete skill: ${errorMessage}` };
  }
}

export async function saveProject(formData: z.infer<typeof projectSchema>) {
  if (process.env.NODE_ENV === 'development') console.log("Saving project:", formData);
  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error);
    return { success: false, message: `Invalid project data: ${parsed.error.message}` };
  }
  try {
    const { id, ...projectData } = parsed.data;
    if (id) {
      await adminDb.collection('projects').doc(id).set(projectData, { merge: true });
      if (process.env.NODE_ENV === 'development') console.log("Project updated:", id);
    } else {
      const docRef = await adminDb.collection('projects').add(projectData);
      if (process.env.NODE_ENV === 'development') console.log("Project created:", docRef.id);
    }
    revalidatePath('/');
    return { success: true, message: 'Project saved successfully.' };
  } catch (e) {
    console.error("Firestore error:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to save project: ${errorMessage}` };
  }
}

// --- Testimonial Actions ---

const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  message: z.string().min(1, 'Message is required'),
  rating: z.number().min(1).max(5).default(5),
  approved: z.boolean().default(false), // Admin can set to true immediately
});

export async function saveTestimonial(formData: z.infer<typeof testimonialSchema>) {
  const parsed = testimonialSchema.safeParse(formData);
  if (!parsed.success) return { success: false, message: 'Invalid data' };

  try {
    const { id, ...data } = parsed.data;

    const payload = {
      ...data,
      createdAt: id ? undefined : new Date().toISOString() // Only set created at on new
    };
    // Remove undefined keys
    Object.keys(payload).forEach(key => payload[key as keyof typeof payload] === undefined && delete payload[key as keyof typeof payload]);

    if (id) {
      await adminDb.collection('testimonials').doc(id).set(payload, { merge: true });
    } else {
      await adminDb.collection('testimonials').add(payload);
    }
    revalidatePath('/');
    return { success: true, message: 'Recommendation saved.' };
  } catch (e) {
    return { success: false, message: 'Failed to save recommendation.' };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await adminDb.collection('testimonials').doc(id).delete();
    revalidatePath('/');
    return { success: true, message: 'Recommendation deleted.' };
  } catch (e) {
    return { success: false, message: 'Failed to delete recommendation.' };
  }
}

export async function updateTestimonialApproval(id: string, approved: boolean) {
  try {
    await adminDb.collection('testimonials').doc(id).set({ approved }, { merge: true });
    revalidatePath('/');
    return { success: true, message: 'Testimonial approval updated.' };
  } catch (e) {
    return { success: false, message: 'Failed to update testimonial approval.' };
  }
}

export async function submitTestimonial(formData: { name: string; role: string; message: string; rating: number }) {
  try {
    const payload = {
      ...formData,
      role: formData.role || 'Visitor',
      approved: false, // Pending approval
      createdAt: new Date().toISOString()
    };

    await adminDb.collection('testimonials').add(payload);
    revalidatePath('/');
    return { success: true, message: 'Review submitted for approval.' };
  } catch (e) {
    console.error('Testimonial submission error:', e);
    return { success: false, message: 'Failed to submit review.' };
  }
}

// --- Experience Actions ---

const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  start: z.string().min(1, 'Start date is required'),
  end: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  order: z.number().optional(),
});

export async function saveExperience(formData: z.infer<typeof experienceSchema>) {
  const parsed = experienceSchema.safeParse(formData);
  if (!parsed.success) return { success: false, message: 'Invalid experience data' };

  try {
    const { id, ...data } = parsed.data;
    if (!id && data.order === undefined) {
      data.order = Date.now();
    }

    if (id) {
      await adminDb.collection('experience').doc(id).set(data, { merge: true });
    } else {
      await adminDb.collection('experience').add(data);
    }
    revalidatePath('/');
    return { success: true, message: 'Experience saved.' };
  } catch (e) {
    return { success: false, message: 'Failed to save experience.' };
  }
}

export async function deleteExperience(id: string) {
  try {
    await adminDb.collection('experience').doc(id).delete();
    revalidatePath('/');
    return { success: true, message: 'Experience deleted.' };
  } catch (e) {
    return { success: false, message: 'Failed to delete experience.' };
  }
}

// --- Certification Actions ---

const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  link: z.string().url('Must be valid URL').optional(),
  image: z.string().optional(),
  credlyId: z.string().optional(),
});

export async function saveCertification(formData: z.infer<typeof certificationSchema>) {
  const parsed = certificationSchema.safeParse(formData);
  if (!parsed.success) return { success: false, message: 'Invalid data' };

  try {
    const { id, ...data } = parsed.data;
    if (id) {
      await adminDb.collection('certifications').doc(id).set(data, { merge: true });
    } else {
      await adminDb.collection('certifications').add(data);
    }
    revalidatePath('/');
    return { success: true, message: 'Certification saved.' };
  } catch (e) {
    return { success: false, message: 'Failed to save certification.' };
  }
}

export async function deleteCertification(id: string) {
  try {
    await adminDb.collection('certifications').doc(id).delete();
    revalidatePath('/');
    return { success: true, message: 'Certification deleted.' };
  } catch (e) {
    return { success: false, message: 'Failed to delete certification.' };
  }
}

// Helper to fetch all pages from Credly
async function fetchAllCredlyBadges(username: string) {
  const badges = [];
  let page = 1;
  let hasMore = true;

  // Use a sensible limit (e.g., 50 pages) to prevent infinite loops
  const MAX_PAGES = 50;

  while (hasMore && page <= MAX_PAGES) {
    try {
      // Credly uses typical page parameter for pagination
      const res = await fetch(`https://www.credly.com/users/${username}/badges.json?page=${page}`);

      if (!res.ok) {
        console.warn(`Failed to fetch Credly page ${page}: ${res.statusText}`);
        hasMore = false;
        break;
      }

      const json = await res.json();
      const pageData = json.data || [];

      if (pageData.length > 0) {
        badges.push(...pageData);
        page++;
      } else {
        // If data array is empty, we reached the end
        hasMore = false;
      }
    } catch (e) {
      console.error(`Error fetching Credly page ${page}:`, e);
      hasMore = false;
    }
  }
  return badges;
}

export async function importCredlyBadges(username: string) {
  try {
    const badges = await fetchAllCredlyBadges(username);

    if (badges.length === 0) {
      return { success: false, message: 'No badges found. Check privacy settings or username.' };
    }

    // Fetch existing certifications to check for duplicates
    // We'll map them by credlyId (preferred) or name (fallback)
    const snapshot = await adminDb.collection('certifications').get();
    const existingCerts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));

    // Map for quick lookup
    const existingMap = new Map();
    existingCerts.forEach(cert => {
      if (cert.credlyId) existingMap.set(cert.credlyId, cert.id);
      else if (cert.name) existingMap.set(cert.name, cert.id); // Fallback to name
    });

    let added = 0;
    let updated = 0;

    for (const badge of badges) {
      const badgeData = {
        name: badge.badge_template.name,
        issuer: badge.issuer.entities[0].entity.name,
        date: badge.issued_at_date,
        link: `https://www.credly.com/badges/${badge.id}`,
        image: badge.image.url,
        credlyId: badge.id // critical for tracking
      };

      const existingId = existingMap.get(badge.id) || existingMap.get(badgeData.name);

      if (existingId) {
        // Update existing
        await adminDb.collection('certifications').doc(existingId).set(badgeData, { merge: true });
        updated++;
      } else {
        // Create new
        await adminDb.collection('certifications').add(badgeData);
        added++;
      }
    }

    revalidatePath('/');
    return { success: true, message: `Synced badges: ${added} added, ${updated} updated.` };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Failed to import badges. Check username.' };
  }
}

export async function importBadgeByUrl(url: string) {
  try {
    // Strict URL validation
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return { success: false, message: 'Invalid URL format.' };
    }

    // Validate hostname exactly
    if (parsedUrl.hostname !== 'www.credly.com' && parsedUrl.hostname !== 'credly.com') {
      return { success: false, message: 'Invalid URL. Must be from credly.com' };
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Portfolio-App/1.0' }
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();

      // Regex to extract OG tags
      const getMeta = (prop: string) => {
        const match = html.match(new RegExp(`<meta property="${prop}" content="([^"]*)"`));
        return match ? match[1] : '';
      };

      const title = getMeta('og:title');
      const image = getMeta('og:image');
      // const description = getMeta('og:description'); // Not strictly needed for listing
      if (!title) throw new Error('Could not find badge title in metadata');

      // Attempt to extract Issuer from title or description if possible, or default
      // Often title is "Badge Name was issued by Issuer Name to ..."
      // Or just "Badge Name"
      let name = title;
      let issuer = 'External Provider';

      // Heuristic: "Badge Name was issued by Issuer to User"
      if (title.includes(' was issued by ')) {
        const parts = title.split(' was issued by ');
        name = parts[0];
        const issuerPart = parts[1].split(' to ')[0];
        issuer = issuerPart;
      }

      // Generate a unique ID from the URL or fallback to name
      // URL: https://www.credly.com/badges/UUID/public_url
      // Regex for UUID
      const uuidMatch = url.match(/\/badges\/([a-zA-Z0-9-]+)/);
      const credlyId = uuidMatch ? uuidMatch[1] : `manual-${Date.now()}`;

      const badgeData = {
        name,
        issuer,
        date: new Date().toISOString().split('T')[0], // Default to today as we can't easily parse different date formats from HTML w/o library
        link: url,
        image,
        credlyId
      };

      // Upsert logic
      const snapshot = await adminDb.collection('certifications').get();
      const existingCerts: any[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const existing = existingCerts.find(c => c.credlyId === credlyId || c.link === url || c.name === name);

      if (existing) {
        await adminDb.collection('certifications').doc(existing.id).set(badgeData, { merge: true });
        revalidatePath('/');
        return { success: true, message: `Updated badge: ${name}` };
      } else {
        await adminDb.collection('certifications').add(badgeData);
        revalidatePath('/');
        return { success: true, message: `Imported badge: ${name}` };
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error(fetchError);
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          return { success: false, message: 'Request timeout. Please try again.' };
        }
        return { success: false, message: `Import failed: ${fetchError.message}` };
      }
      return { success: false, message: 'Import failed: Unknown error' };
    }
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return { success: false, message: `Import failed: ${e.message}` };
    }
    return { success: false, message: 'Import failed: Unknown error' };
  }
}

// --- Education Actions ---

const educationSchema = z.object({
  id: z.string().optional(),
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  year: z.string().min(1, 'Year is required'),
  description: z.string().optional(),
  order: z.number().optional(),
});

export async function saveEducation(formData: z.infer<typeof educationSchema>) {
  const parsed = educationSchema.safeParse(formData);
  if (!parsed.success) return { success: false, message: 'Invalid education data' };

  try {
    const { id, ...data } = parsed.data;

    if (!id && data.order === undefined) {
      data.order = Date.now();
    }

    if (id) {
      await adminDb.collection('education').doc(id).set(data, { merge: true });
    } else {
      await adminDb.collection('education').add(data);
    }
    revalidatePath('/');
    return { success: true, message: 'Education saved.' };
  } catch (e) {
    return { success: false, message: 'Failed to save education.' };
  }
}

export async function deleteEducation(id: string) {
  try {
    await adminDb.collection('education').doc(id).delete();
    revalidatePath('/');
    return { success: true, message: 'Education deleted.' };
  } catch (e) {
    return { success: false, message: 'Failed to delete education.' };
  }
}

// --- Profile Actions ---

const profileSchema = z.object({
  name: z.string().min(1),
  tagline: z.string(),
  summary: z.string(),
  location: z.string(),
  email: z.string().email(),
  phone: z.string(),
  resume: z.string().optional(),
  social: z.object({
    github: z.string(),
    linkedin: z.string(),
    website: z.string(),
    email: z.string()
  })
});

export async function saveProfile(formData: z.infer<typeof profileSchema>) {
  const parsed = profileSchema.safeParse(formData);
  if (!parsed.success) return { success: false, message: 'Invalid profile data' };

  try {
    await adminDb.collection('profile').doc('main').set(parsed.data, { merge: true });
    revalidatePath('/');
    return { success: true, message: 'Profile updated.' };
  } catch (e) {
    return { success: false, message: 'Failed to update profile.' };
  }
}

export async function deleteProject(id: string) {
  try {
    if (!id) throw new Error("Document ID is required for deletion.");
    await adminDb.collection('projects').doc(id).delete();
    revalidatePath('/');
    return { success: true, message: 'Project deleted successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete project: ${errorMessage}` };
  }
}

export async function fetchGithubRepos(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.statusText}`);
    }
    const repos = await res.json();
    return {
      success: true,
      data: repos.map((repo: any) => ({
        id: String(repo.id),
        name: repo.name,
        description: repo.description || '',
        html_url: repo.html_url,
        homepage: repo.homepage || '',
        topics: repo.topics || [],
        language: repo.language,
        stargazers_count: repo.stargazers_count
      }))
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to fetch GitHub repos: ${errorMessage}` };
  }
}

export async function verifyAccessCode(code: string) {
  const correctCode = process.env.ADMIN_ACCESS_CODE;
  if (!correctCode) {
    return { success: false, message: 'Admin access code not configured on server.' };
  }
  if (code === correctCode) {
    return { success: true };
  }
  return { success: false, message: 'Invalid access code.' };
}

export async function extractOgImage(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch URL');
    const html = await res.text();
    const match = html.match(/<meta property="og:image" content="([^"]*)"/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}
