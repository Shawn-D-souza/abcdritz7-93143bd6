import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Background3D } from "@/components/Background3D";

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      <Background3D />
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-32 md:px-12">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mb-10 text-sm text-muted-foreground">Last Updated: May 1st, 2024</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p>
            This Privacy Policy describes how Ritz7 Automations Private Limited collects, uses, and shares information when you use our website, software, and services (collectively, the "Services").
          </p>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Information We Collect</h2>
            <p>We collect information that you provide to us, such as your name, email address, and company name. We also collect information about your use of the Services, such as the pages you visit and the features you use.</p>
            <p className="mt-3">We may collect information automatically through the use of cookies, web beacons, and other tracking technologies. This information may include your IP address, browser type, device type, operating system, and other usage information.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Use of Information</h2>
            <p>We use the information we collect to provide and improve the Services, personalize your experience, communicate with you, and comply with legal obligations.</p>
            <p className="mt-3">We may share your information with third-party service providers who perform services on our behalf, such as hosting, data analysis, and customer service.</p>
            <p className="mt-3">We may also share your information with our affiliates and business partners, but we will not sell your information to third parties.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Cookies and Tracking Technologies</h2>
            <p>We use cookies and other tracking technologies to collect and store information about your use of the Services. You may set your browser to refuse cookies, but this may limit your ability to use certain features of the Services.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Third-Party Websites</h2>
            <p>The Services may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Security</h2>
            <p>We take reasonable measures to protect your information from unauthorized access, disclosure, or destruction. However, no security measures are perfect, and we cannot guarantee the security of your information.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Children's Privacy</h2>
            <p>The Services are not intended for use by children under the age of 13, and we do not knowingly collect information from children under the age of 13. If we become aware that we have collected information from a child under the age of 13, we will take steps to delete such information.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on the Services. You are advised to review this Privacy Policy periodically for any changes.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@ritz7.com" className="text-primary hover:underline">support@ritz7.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
