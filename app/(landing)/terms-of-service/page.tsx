import { Globe } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 w-full items-center justify-center gap-x-6 px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="/">
          <Badge
            className="select-none whitespace-nowrap text-muted-foreground hover:border-primary/50 hover:text-primary/60"
            variant="outline"
          >
            Expenses
            <Globe className="mx-1 size-5" />
            Multiplatform
          </Badge>
          <span className="sr-only">Expenses Multiplatform</span>
        </Link>
      </header>
      {/* Main Content */}
      <main className="flex w-full flex-col items-center justify-center">
        <div className="p-20 md:max-w-[700px]">
          <h2 className="mb-4 font-semibold text-xl">Terms of service</h2>
          <p className="mb-4">Last Updated: 29/10/2024</p>
          <p className="mb-6">
            By accessing or using our expense tracking application Expenses
            Multiplatform, you agree to comply with and be bound by these Terms
            of Service . If you do not agree, please do not use our Service.
          </p>

          {/* Sections */}
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold text-lg text-primary">
                1. Acceptance of Terms
              </h3>
              <p className="">
                By downloading, accessing, or using our Service, you agree to
                abide by these Terms and our Privacy Policy. If you are using
                our Service on behalf of an organization, you are agreeing on
                behalf of that organization.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                2. Eligibility
              </h3>
              <p className="">
                To use our Service, you must be at least 13 years old. If you
                are under the age of 18, you must have the permission of a
                parent or legal guardian.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                3. Account Registration
              </h3>
              <p className="">
                You may be required to create an account to use some features of
                our Service. You are responsible for maintaining the
                confidentiality of your account and password.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                4. Use of the Service
              </h3>
              <p className="">
                You may use the Service only for lawful purposes. You agree not
                to use the Service to upload or distribute unlawful content or
                violate any applicable law.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                5. Data Privacy and Security
              </h3>
              <p className="">
                We respect your privacy. By using our Service, you agree to the
                collection, use, and disclosure of your information as outlined
                in our Privacy Policy.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                6. Intellectual Property
              </h3>
              <p className="">
                All content on our Service is our property or that of our
                licensors and is protected by copyright, trademark, and other
                intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                7. Modifications to the Service
              </h3>
              <p className="">
                We reserve the right to modify, suspend, or discontinue any part
                of our Service at any time without notice.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                8. Disclaimer of Warranties
              </h3>
              <p className="">
                Our Service is provided &quout;as is&quout; and &quout;as
                available.&quout; We make no warranties about the completeness,
                accuracy, reliability, or availability of our Service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                9. Limitation of Liability
              </h3>
              <p className="">
                We are not liable for any indirect, incidental, special, or
                consequential damages arising out of or related to your use of
                the Service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                10. Termination
              </h3>
              <p className="">
                We reserve the right to terminate or suspend your account at our
                discretion, without notice, if we believe you have violated
                these Terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                11. Governing Law
              </h3>
              <p className="">
                These Terms are governed by the laws of [Your Jurisdiction].
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-primary">
                12. Contact Us
              </h3>
              <p className="">
                If you have questions or concerns about these Terms, please
                contact us at [Contact Email].
              </p>
            </section>
          </div>
        </div>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-gray-500 text-xs dark:text-gray-400">
          © 2024 Expenses Multiplatform. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link
            className="text-xs underline-offset-4 hover:underline"
            href="terms-of-service"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs underline-offset-4 hover:underline"
            href="privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
