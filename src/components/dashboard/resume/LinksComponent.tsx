import { Dispatch, SetStateAction } from "react";

import { type Form } from "../../../lib/resume/interfaces"


interface LinksComponentProps {
    links: string[];
    setFormData: Dispatch<SetStateAction<Form>>;
}

const LinksComponent = ({ links, setFormData }: LinksComponentProps) => {
    return (
        <>
            <h3>Links</h3>
            {links.map((link, index) => {
                return (
                    <div key={`links[${index}]`}>
                        <input
                            type="url"
                            name={`links[${index}]`}
                            placeholder="https://example.com"
                            value={link}
                            onChange={(e) =>
                                setFormData((prev) => {
                                    const result = [...prev.links];
                                    result[index] = e.target.value;
                                    return { ...prev, links: result };
                                })
                            }
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                setFormData((prev) => ({
                                    ...prev,
                                    links: prev.links.filter((_, i) => i !== index),
                                }))
                            }}
                        >
                            Remove
                        </button>
                    </div>
                );
            })}
            <input
                type="button"
                value="Add Link"
                onClick={(e) => {
                    e.preventDefault()
                    return (
                        setFormData((prev) => ({
                            ...prev,
                            links: [...prev.links, ""],
                        }))
                    )
                }}
            />
        </>
    );
};

export default LinksComponent;