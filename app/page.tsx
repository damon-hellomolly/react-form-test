"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  CheckCircle2,
  Shield,
  Save,
  Upload,
  Send,
} from "lucide-react";

//import CustomerForm from '@/components/custom-form'
export default function DeveloperTest() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5">
      {/**dialog for the contact us form */}
      {/* <CustomerForm /> */}
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                React Developer Test
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Technical Assessment Challenge
              </p>
            </div>
            {/**this button could open the contact us form in a dialog */}
            <Button variant="outline" size="lg" className="gap-2">
              <FileText className="h-5 w-5" />
              Contact Us Form
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              Contact Form Challenge
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Build a production-ready contact form with advanced features
              including file upload validation, CAPTCHA protection, and session
              storage persistence.
            </p>
          </div>

          {/* Requirements */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Requirements
              </h3>
            </div>

            <div className="space-y-6">
              {/* Form Fields */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
                    1
                  </span>
                  Form Fields
                </h4>
                <p className="text-muted-foreground pl-8">
                  Create a form with the following fields, all with proper
                  validation:
                </p>
                <ul className="pl-8 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Name</strong> -
                      Required, minimum 2 characters
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Email</strong> -
                      Required, valid email format
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Subject</strong> -
                      Required, minimum 5 characters
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong className="text-foreground">Message</strong> -
                      Required, minimum 10 characters, textarea
                    </span>
                  </li>
                </ul>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
                    2
                  </span>
                  File Upload
                </h4>
                <ul className="pl-8 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Upload className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Support multiple file attachments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Upload className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      <strong className="text-foreground">
                        Total file size must not exceed 25MB
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Upload className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Display file names and sizes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Upload className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      Allow removing individual files before submission
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Upload className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      Show validation error if total size exceeds limit
                    </span>
                  </li>
                </ul>
              </div>

              {/* CAPTCHA */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
                    3
                  </span>
                  CAPTCHA Protection
                </h4>
                <ul className="pl-8 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      Implement a simple CAPTCHA to defend against bots and
                      scripts
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      Can be a simple math challenge or checkbox verification
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Must be validated before form submission</span>
                  </li>
                </ul>
              </div>

              {/* API Simulation */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
                    4
                  </span>
                  API Simulation
                </h4>
                <ul className="pl-8 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Send className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Simulate a fetch API call with a 2-second delay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Send className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Show loading state during submission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Send className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      On success, display a popup/toast message:{" "}
                      <strong className="text-foreground">
                        "Message successfully delivered"
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Send className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      Save the successful submission result to session storage
                    </span>
                  </li>
                </ul>
              </div>

              {/* Session Storage */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
                    5
                  </span>
                  Session Storage (Critical Requirement)
                </h4>
                <ul className="pl-8 space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Save className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      <strong className="text-foreground">
                        Auto-save form data to session storage
                      </strong>{" "}
                      as the user types
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Save className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      If the form is closed or page is refreshed accidentally,{" "}
                      <strong className="text-foreground">
                        restore the form data
                      </strong>{" "}
                      from session storage
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Save className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      Clear session storage after successful submission
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Save className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>
                      Store submitted results in session storage for review
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Bonus Points */}
          <Card className="p-8 space-y-4 bg-accent/20 border-accent">
            <h3 className="text-xl font-bold text-foreground">
              Critical point
            </h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent-foreground">+</span>
                <span>
                  Implement proper TypeScript types for all data structures
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-foreground">+</span>
                <span>
                  Make the form fully accessible (ARIA labels, keyboard
                  navigation)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-foreground">+</span>
                <span>Responsive design that works on mobile devices</span>
              </li>
            </ul>
          </Card>

          {/* Technical Stack */}
          <Card className="p-8 space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              Technical Stack
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
              <div>
                <strong className="text-foreground">Framework:</strong> Next.js
                16 with App Router
              </div>
              <div>
                <strong className="text-foreground">Language:</strong>{" "}
                TypeScript
              </div>
              <div>
                <strong className="text-foreground">Styling:</strong> Tailwind
                CSS
              </div>
            </div>
          </Card>

          {/* Submission */}
          <Card className="p-8 space-y-4 bg-primary/5 border-primary/20">
            <h3 className="text-xl font-bold text-foreground">
              Submission Guidelines
            </h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                <span>
                  Create a new Next.js project or use the provided starter
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                <span>
                  Build the contact form according to all requirements
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                <span>
                  Test thoroughly - especially the session storage persistence
                  feature
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">4.</span>
                <span>Submit your code via GitHub repository or ZIP file</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">5.</span>
                <span>Include a README with setup instructions</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
