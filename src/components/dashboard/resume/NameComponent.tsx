import React from "react";
import type { Form } from "../../../lib/resume/interfaces";

type Props = {
    name: string;
    setFormData: React.Dispatch<React.SetStateAction<Form>>;
};

const NameComponent = ({ name, setFormData }: Props) => {
    return (
        <div className="input name">
            <h3>Name</h3>
            <input
                type="text"
                name="name"
                value={name}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
            />
        </div>
    );
};

export default NameComponent;

