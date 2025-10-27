"use client"

import { useReveal } from "@/hooks/use-reveal"

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 sm:px-6 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-8 transition-all duration-700 sm:mb-12 md:mb-16 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-6xl lg:text-7xl">
            Features
          </h2>
          <p className="font-mono text-xs text-foreground/60 sm:text-sm md:text-base">/ Built for agency efficiency</p>
        </div>

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {[
            {
              number: "01",
              title: "Verified Contact Data",
              category: "Emails & Phone Numbers",
              year: "Real-time",
              direction: "left",
            },
            {
              number: "02",
              title: "Smart Filtering",
              category: "Location, Size & Industry",
              year: "Instant",
              direction: "right",
            },
            {
              number: "03",
              title: "CSV Export",
              category: "One-Click Download",
              year: "Seamless",
              direction: "left",
            },
          ].map((project, i) => (
            <ProjectCard key={i} project={project} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: { number: string; title: string; category: string; year: string; direction: string }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      className={`group flex items-center justify-between border-b border-foreground/10 py-4 transition-all duration-700 hover:border-foreground/20 sm:py-6 md:py-8 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
        marginLeft: "0",
        maxWidth: "100%",
      }}
    >
      <div className="flex items-baseline gap-3 sm:gap-4 md:gap-8">
        <span className="font-mono text-xs text-foreground/30 transition-colors group-hover:text-foreground/50 sm:text-sm md:text-base">
          {project.number}
        </span>
        <div>
          <h3 className="mb-1 font-sans text-lg font-light text-foreground transition-transform duration-300 group-hover:translate-x-2 sm:text-xl md:text-3xl lg:text-4xl">
            {project.title}
          </h3>
          <p className="font-mono text-[10px] text-foreground/50 sm:text-xs md:text-sm">{project.category}</p>
        </div>
      </div>
      <span className="hidden font-mono text-xs text-foreground/30 sm:inline md:text-sm">{project.year}</span>
    </div>
  )
}
