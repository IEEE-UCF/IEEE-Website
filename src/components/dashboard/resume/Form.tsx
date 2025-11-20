import { useState } from "react";

import ProjectsComponent from "./ProjectsComponent"
import LinksComponent from "./LinksComponent"
import SkillsComponent from "./SkillsComponent"
import PictureComponent from "./PictureComponent" 
import ResumeComponent from "./ResumeComponent"
import SchoolYearComponent from "./SchoolYearComponent";
import GraduationYearComponent from "./GraduationYearComponent";
import WorkExperienceComponent from "./WorkExperienceComponent";
import NameComponent from "./NameComponent";
import BioComponent from "./BioComponent";
import MajorComponent from "./MajorComponent";
import EducationComponent from "./EducationComponent";

import { type Form, createEmptyForm, createEmptyExperience, createEmptyEducation } from "../../../lib/resume/interfaces"

const Form = () => {
    const [formData, setFormData] = useState<Form>(createEmptyForm());

    const handleSubmit = async (event: React.FormEvent) => {
        // event.preventDefault();
        // try {
        //     const response = await fetch("http://localhost:3001", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(formData),
        //     });
        //     const data = await response.json();
        //     console.log(data);
        //     console.log(formData)
        // } catch (error) {
        //     console.error("Error: ", error);
        // }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                
                <div className="input name">
                    <NameComponent 
                        name={formData.name} 
                        setFormData={setFormData} 
                    />
                </div>

                <div className="input bio">
                    <BioComponent 
                        bio={formData.bio} 
                        setFormData={setFormData} 
                    />
                </div>


                <div className="input resume">
                    <ResumeComponent
                        resume={formData.resume}
                        resumeType={formData.resumeType}
                        setFormData={setFormData}
                    />
                </div>

                <div className="input major">
                    <MajorComponent 
                        major={formData.major} 
                        setFormData={setFormData} 
                    />
                </div>

                <div className="input links">
                    <LinksComponent
                        links={formData.links}
                        setFormData={setFormData}
                    />
                </div>

                <div className="input work-experience">
                    <WorkExperienceComponent
                        workExperience={formData.workExperience}
                        setFormData={setFormData}
                    />
                </div>

                <div className="input graduation-year">
                    <GraduationYearComponent
                        graduationYear={formData.graduationYear}
                        setFormData={setFormData}
                    />
                </div>


                <div className="input school-year">
                    <SchoolYearComponent
                        schoolYear = { formData.schoolYear }
                        setFormData = { setFormData }
                    />
                </div>

                 <div className="input education">
                    <EducationComponent 
                        educations={formData.education} 
                        setFormData={setFormData} 
                    />
                </div>

                <div className="input work-experience">
                    <WorkExperienceComponent
                        workExperience = {formData.workExperience}
                        setFormData = {setFormData}
                    />
                </div>

                <div className="input picture">
                    <PictureComponent setFormData={setFormData} />
                </div>

                <div className="input projects">
                    <ProjectsComponent
                        projects={formData.projects}
                        setFormData={setFormData}
                    />
                </div>

                <div className="input skills">
                    <SkillsComponent
                        skills={formData.skills}
                        setFormData={setFormData}
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
        </>
    );
};

export default Form;
