import React, { useCallback } from "react";
import type { Education, Form } from "../interfaces";
import { createEmptyEducation } from "../interfaces";

type Props = {
    educations: Education[];
    setFormData: React.Dispatch<React.SetStateAction<Form>>;
};

export default function EducationComponent({ educations, setFormData }: Props): React.ReactElement {
    const updateItem = useCallback(
        (index: number, patch: Partial<Education>) => {
            setFormData((prev: Form) => ({
                ...prev,
                education: prev.education.map((it: Education, i: number) => (i === index ? { ...it, ...patch } : it))
            }));
        },
        [setFormData]
    );

    const addItem = useCallback(() => {
        setFormData((prev: Form) => ({
            ...prev,
            education: [...prev.education, createEmptyEducation()]
        }));
    }, [setFormData]);

    const removeItem = useCallback(
        (index: number) => {
            setFormData((prev: Form) => ({
                ...prev,
                education: prev.education.filter((_: Education, i: number) => i !== index)
            }));
        },
        [setFormData]
    );

    return (
        <>
            <h3>Education</h3>
            {educations.map((education, index) => {
                return (
                    <div key={`education[${index}]`} className="education-entry">
                        <h4>Education {index + 1}</h4>
                        <input
                            type="text"
                            name={`education[${index}].name`}
                            placeholder="School Name"
                            value={education.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateItem(index, { name: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            name={`education[${index}].degree`}
                            placeholder="Degree"
                            value={education.degree}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateItem(index, { degree: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            name={`education[${index}].gpa.gpa`}
                            placeholder="GPA"
                            value={education.gpa.gpa || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateItem(index, {
                                    gpa: { ...education.gpa, gpa: Number(e.target.value) },
                                })
                            }
                            step="0.01"
                            min="0"
                            max={education.gpa.scale || 4}
                        />
                        <input
                            type="number"
                            name={`education[${index}].gpa.scale`}
                            placeholder="GPA Scale"
                            value={education.gpa.scale || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateItem(index, {
                                    gpa: { ...education.gpa, scale: Number(e.target.value) },
                                })
                            }
                            step="0.01"
                            min="0"
                        />
                        <div className="dates">
                            <input
                                type="month"
                                name={`education[${index}].dates.start`}
                                placeholder="Start Date"
                                value={education.dates.start}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value > education.dates.end && education.dates.end !== "") {
                                        alert("Start date cannot be after end date.");
                                        (document.getElementsByName(
                                            `education[${index}].dates.start`
                                        )[0] as HTMLInputElement).value = "";
                                        return;
                                    }
                                    updateItem(index, { dates: { ...education.dates, start: e.target.value } });
                                }}
                            />
                            <input
                                type="month"
                                name={`education[${index}].dates.end`}
                                placeholder="End Date"
                                value={education.dates.end}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value < education.dates.start && education.dates.start !== "") {
                                        alert("Start date cannot be after end date.");
                                        (document.getElementsByName(
                                            `education[${index}].dates.end`
                                        )[0] as HTMLInputElement).value = "";
                                        return;
                                    }
                                    updateItem(index, { dates: { ...education.dates, end: e.target.value } });
                                }}
                            />
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <button type="button" onClick={() => removeItem(index)}>
                                Remove Entry
                            </button>
                        </div>
                    </div>
                );
            })}
            <input
                type="button"
                value="Add Education"
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    addItem();
                }}
            />
        </>
    );
}
