"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Faq() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const faqsData = [
    {
      question: "Is isroot.in really free?",
      answer:
        "Yes. No credit card required, no hidden fees, and no usage limits. Built for students and developers.",
    },
    {
      question: "How fast do DNS changes apply?",
      answer:
        "Most updates apply instantly. In some cases, global propagation may take a few minutes depending on the TTL.",
    },
    {
      question: "What is the validity of the domain?",
      answer:
        "The domain is valid for 1 year. We will send you a reminder email before renewal.",
    },
    {
      question: "Do you support custom nameservers?",
      answer:
        "Not yet. Custom nameservers are currently not supported because we are not listed in the Public Suffix List. This feature will be available soon.",
    },
    {
      question: "What if my desired name is already taken?",
      answer:
        "Get creative and try a unique variation to find an available name.",
    },
  ]

  return (
    <section id="faq" className="relative py-24 px-6 bg-background">
      {/* subtle background */}
      <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-background to-background pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-14">
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know before getting started.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqsData.map((faq, idx) => {
            const isOpen = openIndex === idx

            return (
              <Card
                key={idx}
                className="group relative overflow-hidden border-border/60 bg-card transition-all duration-300 hover:border-accent/50"
              >
                {/* hover gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left"
                >
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <CardTitle className="text-base md:text-lg font-medium">
                      {faq.question}
                    </CardTitle>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </CardHeader>
                </button>

                <CardContent
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-6"
                      : "grid-rows-[0fr] opacity-0 pb-0"
                  }`}
                >
                  <div className="overflow-hidden text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
