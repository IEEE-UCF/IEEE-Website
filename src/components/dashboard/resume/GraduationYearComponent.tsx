import { Dispatch, SetStateAction } from "react";

import { Form } from "../../../lib/resume/interfaces";

interface GraduationYearComponentProps {
    graduationYear: number;
    setFormData: Dispatch<SetStateAction<Form>>;
}

const GraduationYearComponent = ({
    graduationYear,
    setFormData
}: GraduationYearComponentProps) => {
    return (
        <div>
            <h3>Graduation Year</h3>
            <input
                type="number"
                name="graduationYear"
                min={2020}
                max={2035}
                value={graduationYear}
                onChange={e =>
                    setFormData(prev => ({
                        ...prev,
                        graduationYear: Number(e.target.value)
                    }))
                }
            />
        </div>
    );
};

export default GraduationYearComponent;
