"use client"

import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useState, useEffect, useRef } from "react"
import { ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Project {
  _id: string
  name: string
  lead: string
  overview: string
  hardware: string[]
  software: string[]
  photo: string
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectData, setProjectData] = useState<Project[]>([])
  const cardsRef = useRef<HTMLDivElement[]>([]) 

  useEffect(() => {
    fetchProjectData()
  }, [])

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: cardsRef.current[0].parentElement, 
            start: "top 20%",
          },
        }
      )
    }
  }, [projectData])

  const viewSidebar = (project: Project) => {
    setSelectedProject(project)
  }

  const closeSidebar = () => {
    setSelectedProject(null)
  }

  const fetchProjectData = async () => {
    const res = await fetch("/api/projects", { method: "GET" })
    const projects = await res.json()
    setProjectData(projects.data)
  }

  return (
    <SidebarProvider
      className="flex flex-col max-w-screen overflow-hidden"
      defaultOpen={false}
      open={selectedProject !== null}
      onOpenChange={(open) => {
        if (!open) setSelectedProject(null)
      }}
    >
      <div
        className={`flex flex-col max-w-screen overflow-hidden bg-transparent transition-all duration-300 ${
          selectedProject ? "blur-sm" : "blur-none"
        }`}
      >
        <div className="relative w-full h-[120vh]">
          <div className="absolute z-4 w-full h-fit inset-0 items-center px-5">
            <Navbar />
          </div>
          <div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r inset-0 items-center px-5 [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_5%,transparent_100%)] z-2"></div>
          <div className="flex flex-row my-30 p-40 px-10 md:px-20 lg:px-40 justify-center lg:justify-end absolute z-3 w-screen">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-y-5 w-full">
              <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-5xl sm:text-6xl">
                PROJECTS
              </div>
              <div className="font-[body-font] text-white text-xl lg:text-2xl w-full lg:w-3/4">
                Tackle real-world challenges by joining or leading IEEE @ UCF’s
                hands-on projects. Members of all skill levels and backgrounds
                can get involved to develop technical experience, collaborate
                with others, and push the boundaries of engineering.
              </div>
            </div>
          </div>
          <div className="relative bg-black h-full w-full">
            <Image
              className="absolute h-full w-full object-cover object-center z-0 opacity-100"
              src="/projects/sechardwaregif2.gif"
              alt="Projects Photo"
              width={2000}
              height={2000}
            />
          </div>
        </div>
        <div className="relative -translate-y-20 w-full overflow-hidden leading-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-20"
          >
            <defs>
              <radialGradient id="bg-gradient" cx="40%" cy="120%" r="125%">
                <stop offset="50%" stopColor="#000000" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
            </defs>

            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86, 82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53, 26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="url(#bg-gradient)"
              transform="scale(1,-1) translate(0,-120)"
            />
          </svg>
        </div>

        <div className="justify-start flex flex-row flex-wrap py-20 px-3 bg-black -translate-y-20">
          {projectData.map((project, index) => (
            <div
              key={project._id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="flex flex-col h-fit w-full md:basis-1/2 lg:basis-1/3 hover:scale-102 transition p-3 opacity-0" // start invisible
            >
              <div className="relative group cursor-pointer hover:scale-102 transition-transform">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-sm blur opacity-25 group-hover:opacity-100 transition duration-300 group-hover:duration-200 "></div>

                <Card className="relative bg-black border-0 h-[95vh]">
                  <CardContent className="">
                    <Image
                      className="object-center object-cover w-full h-80 rounded-sm mb-4 border-white"
                      src={project.photo || "/larry.png"}
                      alt={project.name}
                      width={2000}
                      height={2000}
                    />

                    <div className="text-white text-xl font-bold mb-2">
                      {project.name}
                    </div>
                    <div className="text-gray-300 mb-2">
                      Project Lead: {project.lead}
                    </div>
                    <div className="text-gray-400 mb-4">
                      {project.overview?.slice(0, 120)}...
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(() => {
                        const allSkills = [
                          ...(project.hardware || []).map((s) => ({ label: s, type: "hw" })),
                          ...(project.software || []).map((s) => ({ label: s, type: "sw" })),
                        ]

                        const maxTotalItems = 6
                        let visibleSkills: typeof allSkills = []
                        let remainingCount = 0

                        if (allSkills.length > maxTotalItems) {
                          visibleSkills = allSkills.slice(0, maxTotalItems - 1) 
                          remainingCount = allSkills.length - visibleSkills.length
                        } else {
                          visibleSkills = allSkills
                        }

                        return (
                          <>
                            {visibleSkills.map((skill, idx) => (
                              <div
                                key={idx}
                                className={`text-white rounded-sm w-fit px-3 py-1 text-sm ${
                                  skill.type === "hw"
                                    ? "bg-[var(--ieee-light-grey)]"
                                    : "bg-[var(--ieee-grey)]"
                                }`}
                              >
                                {skill.label}
                              </div>
                            ))}
                            {remainingCount > 0 && (
                              <div className="text-white rounded-sm w-fit px-3 py-1 bg-[var(--ieee-dark-grey)] text-sm font-[subheading-font]">
                                +{remainingCount} more
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>



                    <div
                      className="relative cursor-pointer flex flex-row justify-between w-full hover:scale-103 transition text-white hover:text-amber-300"
                      onClick={() => viewSidebar(project)}
                    >
                      LEARN MORE
                      <ChevronRight />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center z-[200]">
          <div className="h-full flex flex-col w-full max-w-[95vw] sm:max-w-md bg-black rounded-sm p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl text-[var(--ieee-bright-yellow)]">
                {selectedProject.name?.toUpperCase()}
              </div>
              <Button
                onClick={closeSidebar}
                className="hover:scale-150 text-white cursor-pointer bg-transparent transition-transform hover:bg-transparent"
              >
                <X size={24} />
              </Button>
            </div>
            <div className="mb-6">
              <Image
                className="w-full h-48 rounded-sm mb-4 object-cover"
                src={selectedProject.photo ? selectedProject.photo : "/larry.png"}
                alt={selectedProject.name}
                width={600}
                height={400}
              />
            </div>
            <div className="space-y-4 flex-1 overflow-auto">
              <div>
                <div className="text-lg font-semibold mb-2 text-[var(--ieee-bright-yellow)]">
                  Project Lead
                </div>
                <div className="text-white">{selectedProject.lead}</div>
              </div>
              <div>
                <div className="text-lg font-semibold mb-2 text-[var(--ieee-bright-yellow)]">
                  Overview
                </div>
                <div className="text-white">{selectedProject.overview}</div>
              </div>
              <div>
                <h3 className="text-lg text-white font-semibold mb-2">
                  Hardware
                </h3>
                <div className="flex flex-wrap gap-2 text-white">
                  {selectedProject.hardware?.length ? (
                    selectedProject.hardware.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="px-3 py-1 bg-[var(--ieee-light-grey)] rounded-sm text-sm"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <p>No hardware specified</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg text-white font-semibold mb-2">
                  Software
                </h3>
                <div className="flex flex-wrap gap-2 text-white">
                  {selectedProject.software?.length ? (
                    selectedProject.software.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="px-3 py-1 bg-[var(--ieee-grey)] rounded-sm text-sm"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <p>No software specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="-mt-20">
        <Footer />
      </div>
    </SidebarProvider>
  )
}
