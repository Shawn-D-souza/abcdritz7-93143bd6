// Define the exact structure we need from the LMS guys
// LMSCategory is no longer used, we use raw strings for categories
export type LMSCategory = string;

export interface LMSCourse {
  id: string;
  title: string;
  description: string;
  category_names: string[]; // array of category names
  duration: string;
  students_count: number;
  average_rating: number;
  thumbnail_url: string;
  tags: string[];
  price_inr: number;
}

export interface LMSDataPayload {
  categories: LMSCategory[];
  tags: string[];
  courses: LMSCourse[];
}

// Ensure you tell the LMS team to provide data matching this structure
export const mockFetchProgramsData = async (): Promise<LMSDataPayload> => {
  // Simulating network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    categories: ["AI & ML", "No-Code", "Automation", "Bootcamps"],
    tags: ["ChatGPT", "Midjourney", "Bubble", "n8n", "Zapier"],
    courses: [
      {
        id: "ai-mastery-001",
        title: "AI Mastery Bootcamp",
        description: "Master ChatGPT, Midjourney, and enterprise AI workflows. Build real projects and deploy AI solutions.",
        category_names: ["Bootcamps", "AI & ML"],
        duration: "12 Weeks",
        students_count: 2400,
        average_rating: 4.9,
        thumbnail_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
        tags: ["ChatGPT", "Midjourney"],
        price_inr: 399
      },
      {
        id: "no-code-002",
        title: "No-Code App Development",
        description: "Build full-stack applications without code. Master Bubble, Glide, and other leading platforms.",
        category_names: ["No-Code"],
        duration: "8 Weeks",
        students_count: 1850,
        average_rating: 4.8,
        thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
        tags: ["Bubble"],
        price_inr: 249
      },
      {
        id: "automation-003",
        title: "n8n Automation Masterclass",
        description: "From simple workflows to complex integrations — become an automation expert with n8n.",
        category_names: ["Automation"],
        duration: "6 Weeks",
        students_count: 1200,
        average_rating: 4.7,
        thumbnail_url: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&q=80",
        tags: ["n8n", "Zapier"],
        price_inr: 199
      }
    ]
  };
};

/* 
SECURITY ARCHITECTURE EXPLANATION (For the Backend):
--------------------------------------------------
NEVER expose your actual LMS API Key, Razorpay Secret Key, or Enrollment Webhook URL on the frontend!
Instead, the flow works like this:
1. Frontend loads Razorpay using only the PUBLIC Key (rzp_live_xxx).
2. User pays. Razorpay gives the frontend a `razorpay_payment_id` and `razorpay_signature`.
3. Frontend sends this payment_id to YOUR SECURE BACKEND (e.g., Supabase Edge Function).
4. The Secure Backend uses the Razorpay Secret Key to verify the signature.
5. If the payment is valid, the Secure Backend uses the LMS API Key to securely hit the LMS API and enroll the user.
*/
