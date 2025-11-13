export interface Experience {
    name: string;
    description: string;
    title: string;
}
export const createEmptyExperience = () => {
    return {
        name: "",
        description: "",
        title: ""
    };
};

export interface Education {
    name: string;
    dates: {
        start: string;
        end: string;
    };
    degree: string;
    gpa: {
        scale: number;
        gpa: number;
    };
    clubs: Experience[];
}
export const createEmptyEducation = (): Education => {
    return {
        name: "",
        dates: {
            start: "",
            end: "",
        },
        degree: "",
        gpa: {
            scale: 0,
            gpa: 0,
        },
        clubs: [createEmptyExperience()],
    };
};

export interface Project {
    name: string;
    description: string;
    link: string;
}
export const createEmptyProject = (): Project => {
    return {
        name: "",
        description: "",
        link: "",
    };
};

export interface Form {
    name: string;
    bio: string;
    resume: any;
    resumeType?: string;
    major: string;
    schoolYear: string;
    graduationYear: number;
    links: string[];
    education: Education[];
    workExperience: Experience[];
    picture: any;
    projects: Project[];
    skills: string[];
}
export const createEmptyForm = (): Form => {
    return {
        name: "",
        bio: "",
        resume: null,
        resumeType: "file",
        major: "",
        schoolYear: "",
        graduationYear: 0,
        links: [""],
        education: [createEmptyEducation()],
        workExperience: [createEmptyExperience()],
        picture: null,
        projects: [createEmptyProject()],
        skills: [""],
    };
};