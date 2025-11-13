import React from "react";
import type { Form } from "../../../lib/resume/interfaces";

type Props = {
    bio: string;
    setFormData: React.Dispatch<React.SetStateAction<Form>>;
    rows?: number;
};

const BioComponent = ({ bio, setFormData, rows = 5 }: Props) => {
    return (
        <div className="input bio">
            <h3>Bio</h3>
            <textarea
                name="bio"
                value={bio}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={rows}
            />
        </div>
    );
};

export default BioComponent;