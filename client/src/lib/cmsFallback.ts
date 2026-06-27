import type { BlogPost, CmsContent } from "./sanity";

function block(text: string) {
  return {
    _type: "block",
    _key: text.slice(0, 12),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "span", text, marks: [] }],
  };
}

const fallbackBlogPosts: BlogPost[] = [
  {
    _id: "fallback-blog-1",
    title: "Navigating Career Transitions in the Age of Agile",
    slug: "career-transitions-age-of-agile",
    excerpt: "How professionals can leverage agile principles to navigate career pivots with clarity and confidence.",
    author: "Rajiv Banerjee",
    publishedAt: "2026-06-01T09:00:00.000Z",
    featured: true,
    body: [
      block("Career transitions are no longer one-time events. In today's fast-changing workplace, professionals must continuously adapt, learn, and reposition themselves."),
      block("Agile principles—iterative progress, feedback loops, and embracing change—offer a practical framework for career growth at any stage."),
      block("Start with a clear assessment of your strengths, then experiment with small steps before committing to a major pivot."),
    ],
  },
  {
    _id: "fallback-blog-2",
    title: "Building Executive Presence as a Mid-Career Professional",
    slug: "executive-presence-mid-career",
    excerpt: "Practical strategies for developing leadership visibility and influence in corporate environments.",
    author: "Rajiv Banerjee",
    publishedAt: "2026-05-15T09:00:00.000Z",
    featured: false,
    body: [
      block("Executive presence is built through consistent communication, thoughtful decision-making, and the ability to inspire trust across teams."),
      block("Focus on clarity in your messaging, composure under pressure, and genuine engagement with colleagues at every level."),
    ],
  },
  {
    _id: "fallback-blog-3",
    title: "Career Clarity for Students and Young Professionals",
    slug: "career-clarity-students-young-professionals",
    excerpt: "A guide to discovering career paths aligned with your interests, abilities, and market opportunities.",
    author: "Rajiv Banerjee",
    publishedAt: "2026-05-01T09:00:00.000Z",
    featured: false,
    body: [
      block("Career clarity begins with understanding yourself—your interests, values, and natural strengths."),
      block("Psychometric assessments, mentorship conversations, and real-world exposure help validate career choices before you commit."),
    ],
  },
];

export const CMS_FALLBACK: CmsContent = {
  standardPlans: [
    { _id: "fallback-pkg-1", planId: "pkg-1", title: "Discover", subgroup: "8-10", price: 5500, features: ["Psychometric assessment", "1 career counselling session", "Lifetime Knowledge Gateway access", "Live webinar invites"] },
    { _id: "fallback-pkg-2", planId: "pkg-2", title: "Discover Plus+", subgroup: "8-10", price: 15000, features: ["Psychometric assessments", "8 career counselling sessions (1/year)", "Custom reports & study abroad guidance", "CV building"] },
    { _id: "fallback-pkg-3", planId: "pkg-3", title: "Achieve Online", subgroup: "10-12", price: 5999, features: ["Psychometric assessment", "1 career counselling session", "Lifetime Knowledge Gateway access", "Pre-recorded webinars"] },
    { _id: "fallback-pkg-4", planId: "pkg-4", title: "Achieve Plus+", subgroup: "10-12", price: 10599, features: ["Psychometric assessment", "4 career counselling sessions", "Custom reports & study abroad guidance", "CV reviews"] },
    { _id: "fallback-pkg-5", planId: "pkg-5", title: "Ascend Online", subgroup: "college", price: 6499, features: ["Psychometric assessment", "1 career counselling session", "Lifetime Knowledge Gateway access", "Pre-recorded webinars"] },
    { _id: "fallback-pkg-6", planId: "pkg-6", title: "Ascend Plus+", subgroup: "college", price: 10599, features: ["Psychometric assessment", "3 career counselling sessions", "Certificate/online course info", "CV reviews for jobs"] },
    { _id: "fallback-mp-3", planId: "mp-3", title: "Ascend Online", subgroup: "working", price: 6499, features: ["Psychometric assessment", "1 career counselling session", "Lifetime Knowledge Gateway access", "Pre-recorded webinars"] },
    { _id: "fallback-mp-2", planId: "mp-2", title: "Ascend Plus+", subgroup: "working", price: 10599, features: ["Psychometric assessment", "3 career counselling sessions", "Certificate/online course info", "CV reviews for jobs"] },
  ],
  customPlans: [
    { _id: "fallback-career-report", planId: "career-report", title: "Career Report", price: 1500, description: "Get a detailed report of your psychometric assessment for a scientific analysis of your interests. Find out where your interests lie and which future paths you can potentially consider." },
    { _id: "fallback-career-report-counselling", planId: "career-report-counselling", title: "Career Report + Career Counselling", price: 3000, description: "Connect with India's top career coaches to analyse your psychometric report and shortlist the top three career paths you're most likely to enjoy and excel at." },
    { _id: "fallback-knowledge-gateway", planId: "knowledge-gateway", title: "Knowledge Gateway + Career Helpline Access", price: 100, description: "Unlock holistic information on your career paths and get direct access to Mentoria's experts, who will resolve your career-related queries through our dedicated Career Helpline. Validate your career decisions from now until you land a job you love." },
    { _id: "fallback-one-to-one-session", planId: "one-to-one-session", title: "One-to-One Session with a Career Expert", price: 3500, description: "Resolve your career queries and glimpse into your future world through a one-on-one session with an expert from your chosen field." },
    { _id: "fallback-college-admission-planning", planId: "college-admission-planning", title: "College Admission Planning", price: 3000, description: "Get unbiased recommendations and details on your future college options in India and abroad, organised in one resourceful planner." },
    { _id: "fallback-exam-stress-management", planId: "exam-stress-management", title: "Exam Stress Management", price: 1000, description: "Get expert guidance on tackling exam stress, planning your study schedule, revision tips and more from India's top educators. Increase your chances of acing exams with a calm and clear mind." },
    { _id: "fallback-cap-100", planId: "cap-100", title: "College Admissions Planner - 100 (CAP-100)", price: 199, description: "Rs.199 for a ranked list of the top 100 colleges in your course. Get an expert-curated list of colleges based on verified cut-offs. CAP-100 ranks the top 100 colleges into four tiers to help you plan smarter: Indian Ivy League, Target, Smart Backup, and Safe Bet colleges. You can then shortlist colleges based on where you stand!" },
  ],
  blogPosts: fallbackBlogPosts,
  testimonials: [
    { _id: "fallback-testimonial-1", name: "Ananya Sharma", role: "Software Engineer", quote: "Rajiv's career guidance helped me transition from development to a leadership role with clarity and confidence.", rating: 5 },
    { _id: "fallback-testimonial-2", name: "Rahul Mehta", role: "Agile Coach", quote: "The agile coaching sessions transformed how our team collaborates and delivers. Highly recommended for corporate teams.", rating: 5 },
    { _id: "fallback-testimonial-3", name: "Priya Desai", role: "College Student", quote: "The psychometric assessment and counselling sessions gave me direction when I was confused about my career path.", rating: 5 },
  ],
  services: [
    { _id: "fallback-service-1", title: "Career Guidance", description: "Personalized career counselling with psychometric assessments and actionable roadmaps for students and professionals.", link: "#services" },
    { _id: "fallback-service-2", title: "Agile Coaching", description: "Expert agile transformation coaching for teams and organizations seeking improved delivery and collaboration.", link: "#services" },
    { _id: "fallback-service-3", title: "Corporate Workshops", description: "Interactive workshops on leadership, communication, and team effectiveness tailored for corporate environments.", link: "#services" },
    { _id: "fallback-service-4", title: "Enterprise Mentoring", description: "One-on-one mentoring for mid and senior-level professionals navigating career growth and transitions.", link: "#services" },
  ],
};
