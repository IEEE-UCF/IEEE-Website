import { Dispatch, SetStateAction } from "react";

import { type Form, type Experience } from "../../../lib/resume/interfaces"

interface WorkExperienceComponentProps {
    workExperience: Experience[];
    setFormData: Dispatch<SetStateAction<Form>>;
}

const createEmptyExperience = (): Experience => ({
    name: "",
    description: "",
    title: "",
});

const WorkExperienceComponent = ({
    workExperience,
    setFormData,
}: WorkExperienceComponentProps) => {
    return (
        <>
            <h3>Work Experience</h3>
            {workExperience.map((experience, index) => (
                <div key={`workExperience[${index}]`} className="experience">
                    <h4>Experience {index + 1}</h4>
                    <input
                        type="text"
                        name={`workExperience[${index}].name`}
                        placeholder="Company Name"
                        value={experience.name}
                        onChange={e =>
                            setFormData(prev => {
                                const result = [...prev.workExperience];
                                result[index].name = e.target.value;
                                return { ...prev, workExperience: result };
                            })
                        }
                    />
                    <input
                        type="text"
                        name={`workExperience[${index}].title`}
                        placeholder="Job Title"
                        value={experience.title}
                        onChange={e =>
                            setFormData(prev => {
                                const result = [...prev.workExperience];
                                result[index].title = e.target.value;
                                return { ...prev, workExperience: result };
                            })
                        }
                    />
                    <textarea
                        name={`workExperience[${index}].description`}
                        placeholder="Description"
                        value={experience.description}
                        onChange={e =>
                            setFormData(prev => {
                                const result = [...prev.workExperience];
                                result[index].description = e.target.value;
                                return { ...prev, workExperience: result };
                            })
                        }
                        rows={3}
                    />
                    <button
                        onClick={e => {
                            e.preventDefault();
                            setFormData(prev => ({
                                ...prev,
                                workExperience: prev.workExperience.filter((_, i) => i !== index),
                            }));
                        }}
                    >
                        Remove Experience
                    </button>
                </div>
            ))}
            <input
                type="button"
                value="Add Experience"
                onClick={e =>
                    setFormData(prev => ({
                        ...prev,
                        workExperience: [...prev.workExperience, createEmptyExperience()],
                    }))
                }
            />
        </>
    );
};

export default WorkExperienceComponent;

