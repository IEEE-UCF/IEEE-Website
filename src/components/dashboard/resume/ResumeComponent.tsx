import { Dispatch, SetStateAction } from "react";

import { type Form } from "../../../lib/resume/interfaces"

interface ResumeComponentProps {
    resume: any;
    resumeType?: string;
    setFormData: Dispatch<SetStateAction<Form>>;
}

const ResumeComponent = ({ resume, resumeType, setFormData }: ResumeComponentProps) => {
    return (
        <>
            <h3>Resume</h3>
            <label>
                <input
                    type="radio"
                    name="resumeType"
                    value="file"
                    checked={resumeType === "file"}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            resumeType: "file",
                            resume: null,
                        }))
                    }
                />
                Upload File
            </label>
            <label>
                <input
                    type="radio"
                    name="resumeType"
                    value="link"
                    checked={resumeType === "link"}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            resumeType: "link",
                            resume: "",
                        }))
                    }
                />
                Provide Link
            </label>
            {resumeType === "file" && (
                <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setFormData((prev) => ({
                                ...prev,
                                resume: file,
                            }));
                        }
                    }}
                />
            )}
            {resumeType === "link" && (
                <input
                    type="url"
                    name="resume"
                    placeholder="https://example.com/resume.pdf"
                    value={resume || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            resume: e.target.value,
                        }))
                    }
                />
            )}
        </>
    );
};

export default ResumeComponent;