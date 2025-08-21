"use client"

import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Project {
  _id: string
  name: string
  lead: string
  overview: string
  hardware: string[]
  software: string[]
  skills: string[]
  photo: string
}

export default function ProjectsPage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectData, setProjectData] = useState<Project[]>([]);

    useEffect(() => {
        fetchProjectData();
    }, []);

    const viewSidebar = (project: Project) => {
        setSelectedProject(project);
    }

    const closeSidebar = () => {
        setSelectedProject(null);
    }

    const fetchProjectData = async () => {
        const res = await fetch("/api/projects", { method: "GET" });
        const projects = await res.json();
        setProjectData(projects.data);
        
    }

    return (
        <SidebarProvider
            defaultOpen={false}
            open={selectedProject !== null}
            onOpenChange={(open) => {
                if (!open) setSelectedProject(null)
            }}
        >
        <div className={`flex flex-col max-w-screen overflow-hidden bg-transparent transition-all duration-300 ${selectedProject ? "blur-sm" : "blur-none"}`}>
            <div className="relative w-full h-[120vh]">
                <div className="absolute z-4 w-full h-fit inset-0 items-center px-5">
                    <Navbar />
                </div>
                <div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r inset-0 items-center px-5 [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_5%,transparent_100%)] z-2"></div>
                <div className="flex flex-row my-30 p-40 absolute z-3 w-screen">
                    <div className="flex flex-col items-left text-left gap-y-5 float">
                        <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-6xl">PROJECTS</div>
                        <div className="font-[body-font] text-white text-2xl w-3/4">
                        Tackle real-world challenges by joining or leading IEEE UCF’s hands-on projects. Members of all skill levels and backgrounds can get involved to develop technical experience, collaborate with others, and push the boundaries of engineering. 
                        </div>
                    </div>
                </div>
                <div className="bg-black h-full w-full">
                    <Image
                    className="absolute h-full w-full object-cover z-0 opacity-50"
                    src="/autismcreature.gif"
                    alt="Events Photo"
                    width={2000}
                    height={2000}
                    />
                </div>
            </div>

        
<div className="justify-start flex flex-row flex-wrap py-20 px-3">
  {projectData.map((project) => (
    <div
      key={project._id}
      className="flex flex-col h-fit w-full md:basis-1/2 lg:basis-1/3 hover:scale-102 transition p-3"
    >
      <div className="relative group cursor-pointer">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-300 group-hover:duration-200"></div>

        <Card className="relative bg-black border-0">
          <CardContent className="p-6">
            <Image
              className="object-center object-cover w-full h-80 rounded-md mb-4"
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
              {project.hardware[0]
                ? project.hardware?.map((skill, skillIndex) => (
                    <div
                      key={`hw-${skillIndex}`}
                      className="text-white rounded-xl w-fit px-3 py-1 bg-[var(--ieee-light-grey)] text-sm"
                    >
                      {skill}
                    </div>
                  ))
                : null}
              {project.software[0]
                ? project.software?.map((skill, skillIndex) => (
                    <div
                      key={`sw-${skillIndex}`}
                      className="text-white rounded-xl w-fit px-3 py-1 bg-[var(--ieee-grey)] text-sm"
                    >
                      {skill}
                    </div>
                  ))
                : null}
              {project.skills[0]
                ? project.skills?.map((skill, skillIndex) => (
                    <div
                      key={`sk-${skillIndex}`}
                      className="text-white rounded-xl w-fit px-3 py-1 bg-[var(--ieee-dark-grey)] text-sm"
                    >
                      {skill}
                    </div>
                  ))
                : null}
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

        <Sidebar side="right" variant="floating">
            <SidebarContent>
                {selectedProject && 
                ( <div className="h-full flex flex-col w-130">
                    <div className="flex items-center justify-between">
                        <div className="text-xl text-[var(--ieee-bright-yellow)]">{selectedProject.name?.toUpperCase()}</div>
                        <Button onClick={closeSidebar} className="hover:scale-150 text-white cursor-pointer bg-transparent transition-transform hover:bg-transparent">
                            <X size={24}/>
                        </Button>
                    </div>

                    <div className="mt-2 pt-4 border-t"></div>

                    <div className="mb-6">
                        <Image
                        className="w-full h-100 rounded-lg mb-4 object-cover"
                        src={selectedProject.photo ? selectedProject.photo : "/larry.png"}
                        alt={selectedProject.name}
                        width={600}
                        height={400}
                        />
                    </div>

                    <div className="space-y-4 flex-1 overflow-auto">
                        <div>
                            <div className="text-lg font-semibold mb-2 text-[var(--ieee-bright-yellow)]">Project Lead</div>
                            <div>{selectedProject.lead}</div>
                        </div>

                        <div>
                            <div className="text-lg font-semibold mb-2 text-[var(--ieee-bright-yellow)]">Overview</div>
                            <div>{selectedProject.overview}</div>
                        </div>

                        <div className="mt-2 pt-4 border-t"></div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Hardware</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedProject.hardware?.length ? (
                                selectedProject.hardware.map((item, itemIndex) => (
                                    <div key={itemIndex} className="px-3 py-1 bg-[var(--ieee-light-grey)] rounded-md text-sm">
                                    {item}
                                    </div>
                                ))
                                ) : (
                                <p>No hardware specified</p>
                                )}
                            </div>
                        </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Software</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.software?.length ? (
                      selectedProject.software.map((item, itemIndex) => (
                        <div key={itemIndex} className="px-3 py-1 bg-[var(--ieee-grey)] rounded-md text-sm">
                          {item}
                        </div>
                      ))
                    ) : (
                      <p>No software specified</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills?.length ? (
                      selectedProject.skills.map((item, itemIndex) => (
                        <div key={itemIndex} className="px-3 py-1 bg-[var(--ieee-dark-grey)] rounded-md text-sm">
                          {item}
                        </div>
                      ))
                    ) : (
                      <p>No skills specified</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}
            </SidebarContent>
        </Sidebar>
    </SidebarProvider>
  )
}
