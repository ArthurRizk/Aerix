"use client"

import { CheckCircle2 } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      return
    }

    setIsSubmitting(true)

    try {
      await fetch(
        "https://discord.com/api/webhooks/1432268369603858513/Xz5LSphHd3WVEA8lF-fNMdJr6DBK0Dhl5EMCnGZQQFxpuKw5U1x9weRmhl1hnAno7xYr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `New waitlist signup: ${email}`,
            embeds: [
              {
                title: "Aerix Waitlist Signup",
                description: `Email: ${email}`,
                color: 3447003,
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        },
      )

      setSubmitSuccess(true)
      setEmail("")

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error("Failed to submit to webhook:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 sm:px-6 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">
          {/* Left side - Waitlist messaging */}
          <div className="flex flex-col justify-center">
            <div
              className={`mb-6 transition-all duration-700 sm:mb-8 md:mb-12 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-3xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl md:mb-3 md:text-7xl lg:text-8xl">
                Join the
                <br />
                waitlist
              </h2>
              <p className="font-mono text-[10px] text-foreground/60 sm:text-xs md:text-base">
                / Early access launching soon
              </p>
            </div>

            <div
              className={`mb-4 transition-all duration-700 sm:mb-6 md:mb-8 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 sm:text-base md:text-xl">
                Be among the first to access our B2B lead intelligence platform. Get verified contacts, smart filters,
                and instant exports.
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {[
                "Early access to 10M+ verified contacts",
                "Priority onboarding and support",
                "Special launch pricing",
                "Exclusive feature previews",
              ].map((benefit, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 transition-all duration-700 sm:gap-3 ${
                    isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${350 + i * 100}ms` }}
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/60 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <span className="text-xs text-foreground/80 sm:text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Email signup form */}
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <label className="mb-2 block font-mono text-[10px] text-foreground/60 sm:text-xs md:mb-3">
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none sm:text-base md:py-3 md:text-lg"
                  placeholder="you@company.com"
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </MagneticButton>
                {submitSuccess && (
                  <div className="mt-3 rounded-lg border border-foreground/20 bg-foreground/5 p-3 text-center sm:mt-4 sm:p-4">
                    <p className="font-mono text-xs font-medium text-foreground sm:text-sm">✓ You're on the list!</p>
                    <p className="mt-1 font-mono text-[10px] text-foreground/70 sm:text-xs">We'll be in touch soon.</p>
                  </div>
                )}
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <p className="text-center font-mono text-[10px] text-foreground/60 sm:text-xs">
                  No spam. Unsubscribe anytime. We respect your privacy.
                </p>
              </div>
            </form>

            {/* Stats */}
            <div
              className={`mt-6 grid grid-cols-2 gap-3 border-t border-foreground/20 pt-4 transition-all duration-700 sm:mt-8 sm:gap-4 sm:pt-6 md:mt-12 md:gap-6 md:pt-8 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: "650ms" }}
            >
              <div>
                <div className="text-xl font-light text-foreground sm:text-2xl md:text-4xl">100+</div>
                <div className="font-mono text-[10px] text-foreground/60 sm:text-xs">On waitlist</div>
              </div>
              <div>
                <div className="text-xl font-light text-foreground sm:text-2xl md:text-4xl">Q2 2026</div>
                <div className="font-mono text-[10px] text-foreground/60 sm:text-xs">Launch date</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
