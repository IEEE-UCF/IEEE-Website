import { Dispatch, SetStateAction } from "react";

import {
    type Experience,
    type Form,
    createEmptyExperience,
} from "../../../lib/resume/interfaces";

interface ClubsComponentProps {
    clubs: Experience[];
    index: number;
    setFormData: Dispatch<SetStateAction<Form>>;
}

const ClubsComponent = ({ clubs, index, setFormData }: ClubsComponentProps) => {
    return (
        <>
            <h3>Clubs</h3>
            {clubs.map((club, clubsIndex) => (
                <div key={`clubs[${clubsIndex}]`} className="club">
                    <h4>Club {clubsIndex + 1}</h4>
                    <input
                        type="text"
                        name={`clubs[${clubsIndex}].name`}
                        placeholder="Club Name"
                        value={club.name}
                        onChange={(e) =>
                            setFormData((prev) => {
                                const updated = [
                                    ...prev.education[index].clubs,
                                ];
                                updated[clubsIndex].name = e.target.value;
                                return { ...prev, clubs: updated };
                            })
                        }
                    />
                    <textarea
                        name={`clubs[${clubsIndex}].description`}
                        placeholder="Description"
                        value={club.description}
                        onChange={(e) =>
                            setFormData((prev) => {
                                const updated = [...prev.education[index].clubs];
                                updated[clubsIndex].description = e.target.value;
                                return { ...prev, clubs: updated };
                            })
                        }
                        rows={3}
                    />
                    <input
                        type="text"
                        name={`clubs[${clubsIndex}].title`}
                        placeholder="Your Title"
                        value={club.title}
                        onChange={(e) =>
                            setFormData((prev) => {
                                const updated = [...prev.education[index].clubs];
                                updated[clubsIndex].title = e.target.value;
                                return { ...prev, clubs: updated };
                            })
                        }
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({
                                ...prev,
                                clubs: prev.education[index].clubs.filter((_, i) => i !== clubsIndex),
                            }));
                        }}
                    >
                        Remove Club
                    </button>
                </div>
            ))}
            <input
                type="button"
                value="Add Club"
                onClick={(e) =>
                    setFormData((prev) => ({
                        ...prev,
                        clubs: [...prev.education[index].clubs, createEmptyExperience()],
                    }))
                }
            />
        </>
    );
};

export default ClubsComponent;
