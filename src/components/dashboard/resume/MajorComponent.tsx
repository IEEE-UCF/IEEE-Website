import React from "react";
import { ucfMajors } from "../../../lib/resume/majors";
import type { Form } from "../../../lib/resume/interfaces";

type Props = {
    major: string;
    setFormData: React.Dispatch<React.SetStateAction<Form>>;
};

const MajorComponent = ({ major, setFormData }: Props) => {
    return (
        <div className="input major">
            <h3>Major</h3>
            <select
                name="major"
                value={major}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, major: e.target.value }))
                }
            >
                <option value="">Select Major</option>
                {ucfMajors.map((m, i) => (
                    <option key={i} value={m}>
                        {m}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MajorComponent;