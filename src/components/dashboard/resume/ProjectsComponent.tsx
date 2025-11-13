import { Dispatch, SetStateAction } from "react";

import { type Form, type Project, createEmptyProject } from "../../../lib/resume/interfaces"

interface ProjectsComponentProps {
    projects: Project[]
    setFormData: Dispatch<SetStateAction<Form>>
}

const ProjectsComponent = ({
    projects,
    setFormData
}: ProjectsComponentProps) => {
    return (
    <>
        <h3>Projects</h3>
        {projects.map((project, index) => (
            <div
                key={`projects[${index}]`}
                className="project"
            >
                <h4>Project {index + 1}</h4>
                <input
                    type="text"
                    name={`projects[${index}].name`}
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) =>
                        setFormData((prev) => {
                            const result = [
                                ...prev.projects,
                            ];
                            result[index].name = e.target.value;
                            return {
                                ...prev,
                                projects: result,
                            };
                        })
                    }
                />
                <textarea
                    name={`projects[${index}].description`}
                    placeholder="Project Description"
                    value={project.description}
                    onChange={(e) =>
                        setFormData((prev) => {
                            const result = [
                                ...prev.projects,
                            ];
                            result[index].description =
                                e.target.value;
                            return {
                                ...prev,
                                projects: result,
                            };
                        })
                    }
                    rows={3}
                />
                <input
                    type="text"
                    placeholder="Project Link"
                    value={project.link}
                    onChange={(e) =>
                        setFormData((prev) => {
                            const result = [
                                ...prev.projects,
                            ];
                            result[index].link = e.target.value;
                            return {
                                ...prev,
                                projects: result,
                            };
                        })
                    }
                />
            </div>
        ))}
        <input
            type="button"
            value="Add Project"
            onClick={(e) => {
                e.preventDefault()
                setFormData((prev) => ({
                    ...prev,
                    projects: [
                        ...prev.projects,
                        createEmptyProject(),
                    ],
                }))
            }}
        />    
    </>
    )
}

export default ProjectsComponent