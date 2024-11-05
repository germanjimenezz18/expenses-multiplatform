import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-center  w-full gap-x-6 ">
        <Link className="flex items-center justify-center" href="/">
          <Badge
            variant="outline"
            className="text-muted-foreground select-none hover:text-primary/60 hover:border-primary/50 whitespace-nowrap"
          >
            Expenses
            <Globe className="size-5 mx-1" />
            Multiplatform
          </Badge>
          <span className="sr-only">Expenses Multiplatform</span>
        </Link>
      </header>
      {/* Main Content */}
      <main className="w-full flex items-center justify-center flex-col">
        <div className="md:max-w-[700px] p-20">
          <h2 className="text-xl font-semibold mb-4">
            Terms of service
          </h2>
          <p className=" mb-4">Last Updated: 29/10/2024</p>
          <p className=" mb-6">
            By accessing or using our expense tracking application Expenses
            Multiplatform, you agree to comply with and be bound by these Terms
            of Service . If you do not agree, please do not use our Service.
          </p>

          {/* Sections */}
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-primary">
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
              <h3 className="text-lg font-semibold text-primary">
                2. Eligibility
              </h3>
              <p className="">
                To use our Service, you must be at least 13 years old. If you
                are under the age of 18, you must have the permission of a
                parent or legal guardian.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
                3. Account Registration
              </h3>
              <p className="">
                You may be required to create an account to use some features of
                our Service. You are responsible for maintaining the
                confidentiality of your account and password.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
                4. Use of the Service
              </h3>
              <p className="">
                You may use the Service only for lawful purposes. You agree not
                to use the Service to upload or distribute unlawful content or
                violate any applicable law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
                5. Data Privacy and Security
              </h3>
              <p className="">
                We respect your privacy. By using our Service, you agree to the
                collection, use, and disclosure of your information as outlined
                in our Privacy Policy.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
                6. Intellectual Property
              </h3>
              <p className="">
                All content on our Service is our property or that of our
                licensors and is protected by copyright, trademark, and other
                intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
                7. Modifications to the Service
              </h3>
              <p className="">
                We reserve the right to modify, suspend, or discontinue any part
                of our Service at any time without notice.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
                8. Disclaimer of Warranties
              </h3>
              <p className="">
                Our Service is provided &quout;as is&quout; and &quout;as
                available.&quout; We make no warranties about the completeness,
                accuracy, reliability, or availability of our Service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
                9. Limitation of Liability
              </h3>
              <p className="">
                We are not liable for any indirect, incidental, special, or
                consequential damages arising out of or related to your use of
                the Service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
                10. Termination
              </h3>
              <p className="">
                We reserve the right to terminate or suspend your account at our
                discretion, without notice, if we believe you have violated
                these Terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
                11. Governing Law
              </h3>
              <p className="">
                These Terms are governed by the laws of [Your Jurisdiction].
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary">
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Expenses Multiplatform. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="terms-of-service"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
