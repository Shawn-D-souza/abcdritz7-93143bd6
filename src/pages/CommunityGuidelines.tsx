import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Background3D } from "@/components/Background3D";

const CommunityGuidelines = () => {
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      <Background3D />
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-32 md:px-12">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Community Guidelines</h1>
        <p className="mb-10 text-sm text-muted-foreground">Last Updated: September 1st, 2025</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p>Welcome to the ABCD Community! To maintain a positive and productive environment, all members must adhere to these guidelines:</p>

          <ul className="list-disc space-y-3 pl-6">
            <li><strong className="text-foreground">Be Respectful:</strong> Treat all members with kindness, courtesy, and professionalism. Discrimination, harassment, or offensive language will not be tolerated.</li>
            <li><strong className="text-foreground">Stay Relevant:</strong> Keep discussions focused on no-code development, technology, and related topics.</li>
            <li><strong className="text-foreground">Collaboration over Competition:</strong> Share knowledge, support others, and foster a collaborative learning atmosphere.</li>
            <li><strong className="text-foreground">No Spam or Promotions:</strong> Avoid unsolicited advertisements, self-promotion, or irrelevant links unless approved by moderators.</li>
            <li><strong className="text-foreground">Protect Privacy:</strong> Do not share personal or sensitive information about others without consent.</li>
            <li><strong className="text-foreground">Compliance:</strong> Follow applicable laws, regulations, and respect intellectual property rights.</li>
            <li><strong className="text-foreground">Payment Responsibility:</strong> For paid events (workshops, cohorts), all payments must be made within the specified timelines. Refunds, if applicable, will adhere to the stated refund policy.</li>
          </ul>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Terms</h2>
            <p className="mb-4">By joining the ABCD Community or registering for our challenges, workshops, or cohorts, you agree to the following terms:</p>

            <ul className="list-disc space-y-3 pl-6">
              <li><strong className="text-foreground">Consent to Guidelines:</strong> You agree to abide by the Community Guidelines outlined above.</li>
              <li><strong className="text-foreground">Personal Data Usage:</strong> The information you provide (name, email, WhatsApp number, and professional level) will be used for community engagement and communication purposes. Your data will not be shared with third parties without your consent.</li>
              <li><strong className="text-foreground">Responsibility for Actions:</strong> You are responsible for the content of your posts, comments, and interactions. ABCD is not liable for disputes arising from member interactions.</li>
              <li><strong className="text-foreground">Content Ownership:</strong> By participating, you grant ABCD permission to share non-confidential content you contribute (e.g., posts, comments) for promotional or educational purposes.</li>
              <li>
                <strong className="text-foreground">Payment Terms:</strong>
                <ol className="mt-2 list-decimal space-y-1 pl-6">
                  <li>Workshops, Cohorts, and Challenges: Payment is required before the start of the event.</li>
                  <li>Refund Policy: Refunds are only available as per the specific terms communicated during registration.</li>
                  <li>Non-Payment: Failure to complete payment may result in removal from the event or denial of access.</li>
                </ol>
              </li>
              <li><strong className="text-foreground">Termination:</strong> Members who violate the guidelines or terms may be removed from the community at the discretion of moderators.</li>
              <li><strong className="text-foreground">Updates:</strong> Guidelines and terms may be updated periodically. Members will be notified of significant changes.</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
