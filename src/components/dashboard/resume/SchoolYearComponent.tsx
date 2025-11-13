import { Dispatch, SetStateAction } from "react";

import { type Form } from "../../../lib/resume/interfaces"

interface SchoolYearComponentProps {
    schoolYear: string;
    setFormData: Dispatch<SetStateAction<Form>>;
}

const schoolYearOptions = [
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "Graduate"
];

const SchoolYearComponent = ({ schoolYear, setFormData }: SchoolYearComponentProps) => {
    return (
        <div>
            <h3>School Year</h3>
            {schoolYearOptions.map(option => (
                <label key={option} style={{ marginRight: 16 }}>
                    <input
                        type="radio"
                        name="schoolYear"
                        value={option}
                        checked={schoolYear === option}
                        onChange={e =>
                            setFormData(prev => ({
                                ...prev,
                                schoolYear: e.target.value
                            }))
                        }
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};

export default SchoolYearComponent;
