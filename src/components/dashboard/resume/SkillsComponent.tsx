import { Dispatch, SetStateAction } from "react";

import { type Form } from "../../../lib/resume/interfaces"

interface SkillsComponentProps {
    skills: string[];
    setFormData: Dispatch<SetStateAction<Form>>;
}

const SkillsComponent = ({ skills, setFormData }: SkillsComponentProps) => {
    return (
        <>
            <h3>Skills</h3>
            {skills.map((skill, index) => {
                return (
                    <div key={`skills[${index}]`}>
                        <input
                            type="text"
                            name={`skills[${index}]`}
                            value={skill}
                            onChange={(e) =>
                                setFormData((prev) => {
                                    const result = [...prev.skills];
                                    result[index] = e.target.value;
                                    return { ...prev, skills: result };
                                })
                            }
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                setFormData((prev) => ({
                                    ...prev,
                                    skills: prev.skills.filter((_, i) => i !== index),
                                }))
                            }}
                        >
                            Remove
                        </button>
                    </div>
                );
            })}
            <button
                onClick={(e) => {
                    e.preventDefault()
                    setFormData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, ""],
                    }))
                }}
            >
                Add Skill
            </button>
        </>
    );
};

export default SkillsComponent;