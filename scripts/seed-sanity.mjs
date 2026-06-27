import { createClient } from "@sanity/client";

const token = process.env.SANITY_EDITOR_TOKEN;
if (!token) throw new Error("SANITY_EDITOR_TOKEN is required");

const client = createClient({
  projectId: "8j37l731",
  dataset: "production",
  apiVersion: "2026-06-01",
  token,
  useCdn: false,
});

async function uploadFromUrl(url, label) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { filename: `${label}.jpg` });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt: label };
}

const [careerImage, agileImage, workshopImage, mentoringImage, blogImage] = await Promise.all([
  uploadFromUrl("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80", "Career guidance"),
  uploadFromUrl("https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80", "Agile coaching"),
  uploadFromUrl("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80", "Corporate workshop"),
  uploadFromUrl("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80", "Enterprise mentoring"),
  uploadFromUrl("https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=900&q=80", "Career blog"),
]);

const standardPlans = [
  ["pkg-1", "Discover", "8-10", 5500, ["Psychometric assessment", "1 career counselling session", "Lifetime Knowledge Gateway access", "Live webinar invites"]],
  ["pkg-2", "Discover Plus+", "8-10", 15000, ["Psychometric assessments", "8 career counselling sessions (1/year)", "Custom reports & study abroad guidance", "CV building"]],
  ["pkg-3", "Achieve Online", "10-12", 5999, ["Psychometric assessment", "1 career counselling session", "Lifetime Knowledge Gateway access", "Pre-recorded webinars"]],
  ["pkg-4", "Achieve Plus+", "10-12", 10599, ["Psychometric assessment", "4 career counselling sessions", "Custom reports & study abroad guidance", "CV reviews"]],
  ["pkg-5", "Ascend Online", "college", 6499, ["Psychometric assessment", "1 career counselling session", "Lifetime Knowledge Gateway access", "Pre-recorded webinars"]],
  ["pkg-6", "Ascend Plus+", "college", 10599, ["Psychometric assessment", "3 career counselling sessions", "Certificate/online course info", "CV reviews for jobs"]],
  ["mp-3", "Ascend Online", "working", 6499, ["Psychometric assessment", "1 career counselling session", "Lifetime Knowledge Gateway access", "Pre-recorded webinars"]],
  ["mp-2", "Ascend Plus+", "working", 10599, ["Psychometric assessment", "3 career counselling sessions", "Certificate/online course info", "CV reviews for jobs"]],
];

const customPlans = [
  ["career-report", "Career Report", 1500, "Get a detailed report of your psychometric assessment for a scientific analysis of your interests. Find out where your interests lie and which future paths you can potentially consider."],
  ["career-report-counselling", "Career Report + Career Counselling", 3000, "Connect with India's top career coaches to analyse your psychometric report and shortlist the top three career paths you're most likely to enjoy and excel at."],
  ["knowledge-gateway", "Knowledge Gateway + Career Helpline Access", 100, "Unlock holistic information on your career paths and get direct access to Mentoria's experts, who will resolve your career-related queries through our dedicated Career Helpline. Validate your career decisions from now until you land a job you love."],
  ["one-to-one-session", "One-to-One Session with a Career Expert", 3500, "Resolve your career queries and glimpse into your future world through a one-on-one session with an expert from your chosen field."],
  ["college-admission-planning", "College Admission Planning", 3000, "Get unbiased recommendations and details on your future college options in India and abroad, organised in one resourceful planner."],
  ["exam-stress-management", "Exam Stress Management", 1000, "Get expert guidance on tackling exam stress, planning your study schedule, revision tips and more from India's top educators. Increase your chances of acing exams with a calm and clear mind."],
  ["cap-100", "College Admissions Planner - 100 (CAP-100)", 199, "Rs.199 for a ranked list of the top 100 colleges in your course. Get an expert-curated list of colleges based on verified cut-offs. CAP-100 ranks the top 100 colleges into four tiers to help you plan smarter: Indian Ivy League, Target, Smart Backup, and Safe Bet colleges. You can then shortlist colleges based on where you stand!"],
];

const block = (text) => ({
  _type: "block",
  _key: crypto.randomUUID().slice(0, 12),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: crypto.randomUUID().slice(0, 12), text, marks: [] }],
});

const planImages = [careerImage, agileImage, workshopImage, mentoringImage];

const documents = [
  ...standardPlans.map(([planId, title, subgroup, price, features], order) => ({
    _id: `standard-plan-${planId}`,
    _type: "standardPlan",
    planId, title, subgroup, price, features, order: order + 1,
    image: planImages[order % planImages.length],
  })),
  ...customPlans.map(([planId, title, price, description], order) => ({
    _id: `custom-plan-${planId}`,
    _type: "customPlan",
    planId, title, price, description, order: order + 1,
    image: planImages[order % planImages.length],
  })),
  {
    _id: "service-career-guidance", _type: "services", title: "Career Guidance",
    description: "Personalized career counselling with psychometric assessments and actionable roadmaps for students and professionals.",
    link: "#services", image: careerImage, order: 1,
  },
  {
    _id: "service-agile-coaching", _type: "services", title: "Agile Coaching",
    description: "Expert agile transformation coaching for teams and organizations seeking improved delivery and collaboration.",
    link: "#services", image: agileImage, order: 2,
  },
  {
    _id: "service-corporate-workshops", _type: "services", title: "Corporate Workshops",
    description: "Interactive workshops on leadership, communication, and team effectiveness tailored for corporate environments.",
    link: "#services", image: workshopImage, order: 3,
  },
  {
    _id: "service-enterprise-mentoring", _type: "services", title: "Enterprise Mentoring",
    description: "One-on-one mentoring for mid and senior-level professionals navigating career growth and transitions.",
    link: "#services", image: mentoringImage, order: 4,
  },
  {
    _id: "testimonial-1", _type: "testimonials", name: "Ananya Sharma", role: "Software Engineer",
    quote: "Rajiv's career guidance helped me transition from development to a leadership role with clarity and confidence.",
    rating: 5, image: careerImage, order: 1,
  },
  {
    _id: "testimonial-2", _type: "testimonials", name: "Rahul Mehta", role: "Agile Coach",
    quote: "The agile coaching sessions transformed how our team collaborates and delivers. Highly recommended for corporate teams.",
    rating: 5, image: agileImage, order: 2,
  },
  {
    _id: "testimonial-3", _type: "testimonials", name: "Priya Desai", role: "College Student",
    quote: "The psychometric assessment and counselling sessions gave me direction when I was confused about my career path.",
    rating: 5, image: workshopImage, order: 3,
  },
  {
    _id: "blog-career-transitions", _type: "blogPost", title: "Navigating Career Transitions in the Age of Agile",
    slug: { _type: "slug", current: "career-transitions-age-of-agile" },
    excerpt: "How professionals can leverage agile principles to navigate career pivots with clarity and confidence.",
    author: "Rajiv Banerjee", publishedAt: "2026-06-01T09:00:00.000Z", featured: true, image: blogImage,
    body: [
      block("Career transitions are no longer one-time events. In today's fast-changing workplace, professionals must continuously adapt, learn, and reposition themselves."),
      block("Agile principles—iterative progress, feedback loops, and embracing change—offer a practical framework for career growth at any stage."),
      block("Start with a clear assessment of your strengths, then experiment with small steps before committing to a major pivot."),
    ],
  },
  {
    _id: "blog-executive-presence", _type: "blogPost", title: "Building Executive Presence as a Mid-Career Professional",
    slug: { _type: "slug", current: "executive-presence-mid-career" },
    excerpt: "Practical strategies for developing leadership visibility and influence in corporate environments.",
    author: "Rajiv Banerjee", publishedAt: "2026-05-15T09:00:00.000Z", featured: false, image: mentoringImage,
    body: [
      block("Executive presence is built through consistent communication, thoughtful decision-making, and the ability to inspire trust across teams."),
      block("Focus on clarity in your messaging, composure under pressure, and genuine engagement with colleagues at every level."),
    ],
  },
  {
    _id: "blog-career-clarity", _type: "blogPost", title: "Career Clarity for Students and Young Professionals",
    slug: { _type: "slug", current: "career-clarity-students-young-professionals" },
    excerpt: "A guide to discovering career paths aligned with your interests, abilities, and market opportunities.",
    author: "Rajiv Banerjee", publishedAt: "2026-05-01T09:00:00.000Z", featured: false, image: careerImage,
    body: [
      block("Career clarity begins with understanding yourself—your interests, values, and natural strengths."),
      block("Psychometric assessments, mentorship conversations, and real-world exposure help validate career choices before you commit."),
    ],
  },
];

let transaction = client.transaction();
for (const document of documents) transaction = transaction.createOrReplace(document);
await transaction.commit();

console.log(`Seeded ${documents.length} Sanity documents.`);
