import React, { useCallback } from "react";
import type { Education } from "../../../lib/resume/interfaces";
import { createEmptyEducation } from "../../../lib/resume/interfaces";

type Props = {
    value: Education[];
    onChange: (next: Education[]) => void;
};

export default function EducationComponent({ value, onChange }: Props) {
    const updateItem = useCallback(
        (index: number, patch: Partial<Education>) => {
            onChange(value.map((it, i) => (i === index ? { ...it, ...patch } : it)));
        },
        [value, onChange]
    );

    const updateClub = useCallback(
        (index: number, clubIndex: number, patch: Partial<Education["clubs"][number]>) => {
            onChange(
                value.map((it, i) =>
                    i === index
                        ? {
                              ...it,
                              clubs: it.clubs.map((c, ci) => (ci === clubIndex ? { ...c, ...patch } : c)),
                          }
                        : it
                )
            );
        },
        [value, onChange]
    );

    const addItem = useCallback(() => {
        onChange([...value, createEmptyEducation()]);
    }, [value, onChange]);

    const removeItem = useCallback(
        (index: number) => {
            onChange(value.filter((_, i) => i !== index));
        },
        [value, onChange]
    );

    return (
        <>
            <h3>Education</h3>
            {value.map((education, index) => {
                return (
                    <div key={`education[${index}]`} className="education-entry">
                        <h4>Education {index + 1}</h4>
                        <input
                            type="text"
                            name={`education[${index}].name`}
                            placeholder="School Name"
                            value={education.name}
                            onChange={(e) =>
                                updateItem(index, { name: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            name={`education[${index}].degree`}
                            placeholder="Degree"
                            value={education.degree}
                            onChange={(e) =>
                                updateItem(index, { degree: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            name={`education[${index}].gpa.gpa`}
                            placeholder="GPA"
                            value={education.gpa.gpa || ""}
                            onChange={(e) =>
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
                            onChange={(e) =>
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
                                onChange={(e) => {
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
                                onChange={(e) => {
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
                        <div className="education-clubs">
                            <h5>Clubs</h5>
                            {education.clubs.map((club, clubIndex) => {
                                return (
                                    <div
                                        key={`education[${index}].clubs[${clubIndex}]`}
                                        className="club"
                                    >
                                        <input
                                            type="text"
                                            name={`education[${index}].clubs[${clubIndex}].name`}
                                            placeholder="Club Name"
                                            value={club.name}
                                            onChange={(e) =>
                                                updateClub(index, clubIndex, { name: e.target.value })
                                            }
                                        />
                                        <input
                                            type="text"
                                            name={`education[${index}].clubs[${clubIndex}].title`}
                                            placeholder="Your Title"
                                            value={club.title}
                                            onChange={(e) =>
                                                updateClub(index, clubIndex, { title: e.target.value })
                                            }
                                        />
                                    </div>
                                );
                            })}
                            <input
                                type="button"
                                value="Add Education"
                                onClick={(e) => {
                                    e.preventDefault();
                                    addItem();
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
        </>
    );
}