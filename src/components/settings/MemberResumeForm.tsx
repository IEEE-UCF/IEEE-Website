"use client";

import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { ResumeUpload } from "./ResumeUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Briefcase,
	GraduationCap,
	FolderGit2,
	Users,
	Award,
	Plus,
	Trash2,
	Check,
	AlertCircle,
	ExternalLink,
	Sparkles,
	Tag,
} from "lucide-react";

interface SocialLinkItem {
	platformName: string;
	profileUrl: string;
}

interface EducationItem {
	schoolName: string;
	degreeType: string;
	major: string;
	gpa?: number;
	gpaScale?: number;
	startDate: string;
	endDate?: string;
	isCurrent: boolean;
	description?: string;
}

interface WorkExperienceItem {
	companyName: string;
	jobTitle: string;
	startDate: string;
	endDate?: string;
	isCurrentJob: boolean;
	description: string;
}

interface ProjectItem {
	projectName: string;
	description: string;
	startDate: string;
	endDate?: string;
	isOngoing: boolean;
	projectLinks: string[];
}

interface ClubItem {
	clubName: string;
	role: string;
	startDate: string;
	endDate?: string;
	isActive: boolean;
	description: string;
}

interface CertificationItem {
	certificationName: string;
	issuer: string;
	issueDate: string;
	expirationDate?: string;
	credentialId?: string;
	credentialUrl?: string;
}

const COMMON_SKILL_SUGGESTIONS = [
	"React", "TypeScript", "Python", "C++", "Java", "Next.js",
	"Node.js", "Docker", "Git", "Linux", "Altium Designer", "MATLAB",
	"AWS", "PostgreSQL", "Tailwind CSS", "Embedded C", "FPGA", "Verilog",
];

export function MemberResumeForm() {
	const utils = trpc.useUtils();
	const { data: resumeProfile, isLoading, error: fetchError } = trpc.member.getMyResumeProfile.useQuery();

	const [status, setStatus] = useState<"Seeking Internship" | "Seeking Full-time" | "Employed">("Seeking Internship");
	const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
	const [education, setEducation] = useState<EducationItem[]>([]);
	const [skills, setSkills] = useState<string[]>([]);
	const [skillInput, setSkillInput] = useState("");
	const [workExperiences, setWorkExperiences] = useState<WorkExperienceItem[]>([]);
	const [projects, setProjects] = useState<ProjectItem[]>([]);
	const [clubs, setClubs] = useState<ClubItem[]>([]);
	const [certifications, setCertifications] = useState<CertificationItem[]>([]);

	const [newLinkUrl, setNewLinkUrl] = useState<Record<number, string>>({});

	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// Populate state once loaded
	useEffect(() => {
		if (!resumeProfile) return;

		const resume = resumeProfile.resume;
		const member = resumeProfile.member;

		if (resume) {
			setStatus(
				(resume.status as "Seeking Internship" | "Seeking Full-time" | "Employed") || "Seeking Internship",
			);
			setSocialLinks(Array.isArray(resume.socialLinks) ? (resume.socialLinks as SocialLinkItem[]) : []);
			setEducation(Array.isArray(resume.education) ? (resume.education as EducationItem[]) : []);
			setSkills(Array.isArray(resume.skills) ? (resume.skills as string[]) : []);
			setWorkExperiences(Array.isArray(resume.workExperiences) ? (resume.workExperiences as WorkExperienceItem[]) : []);
			setProjects(Array.isArray(resume.projects) ? (resume.projects as ProjectItem[]) : []);
			setClubs(Array.isArray(resume.clubs) ? (resume.clubs as ClubItem[]) : []);
			setCertifications(Array.isArray(resume.certifications) ? (resume.certifications as CertificationItem[]) : []);
		} else {
			// Initialize with sensible defaults from member account
			setStatus("Seeking Internship");
			setEducation([
				{
					schoolName: "University of Central Florida",
					degreeType: "Bachelor of Science",
					major: member.major || "Computer Science",
					startDate: `${member.graduationYear ? member.graduationYear - 4 : 2022}-08-20`,
					endDate: `${member.graduationYear || 2026}-05-05`,
					isCurrent: true,
					gpa: undefined,
					gpaScale: 4.0,
					description: "",
				},
			]);
			const links: SocialLinkItem[] = [];
			if (member.linkedinURL) links.push({ platformName: "LinkedIn", profileUrl: member.linkedinURL });
			if (member.githubURL) links.push({ platformName: "GitHub", profileUrl: member.githubURL });
			if (member.websiteURL) links.push({ platformName: "Portfolio", profileUrl: member.websiteURL });
			setSocialLinks(links);
		}
	}, [resumeProfile]);

	const updateResume = trpc.member.updateMyResumeProfile.useMutation({
		onSuccess: () => {
			setSuccessMsg("Resume portfolio saved successfully!");
			setErrorMsg(null);
			void utils.member.getMyResumeProfile.invalidate();
			setTimeout(() => setSuccessMsg(null), 4000);
		},
		onError: (err) => {
			setErrorMsg(err.message || "Failed to update resume profile");
			setSuccessMsg(null);
		},
	});

	// --- Skill Handlers ---
	const handleAddSkill = (skillToAdd?: string) => {
		const skill = (skillToAdd || skillInput).trim();
		if (!skill) return;
		if (skills.length >= 50) {
			setErrorMsg("Maximum of 50 skills reached (Data.md limit).");
			return;
		}
		if (skill.length > 50) {
			setErrorMsg("Each skill tag must be under 50 characters.");
			return;
		}
		if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
			setSkillInput("");
			return;
		}
		setSkills([...skills, skill]);
		setSkillInput("");
		setErrorMsg(null);
	};

	const handleRemoveSkill = (indexToRemove: number) => {
		setSkills(skills.filter((_, idx) => idx !== indexToRemove));
	};

	// --- Education Handlers ---
	const handleAddEducation = () => {
		setEducation([
			...education,
			{
				schoolName: "",
				degreeType: "Bachelor of Science",
				major: "",
				startDate: "",
				endDate: "",
				isCurrent: false,
				gpa: undefined,
				gpaScale: 4.0,
				description: "",
			},
		]);
	};

	const handleRemoveEducation = (idx: number) => {
		setEducation(education.filter((_, i) => i !== idx));
	};

	// --- Work Experience Handlers ---
	const handleAddWorkExperience = () => {
		if (workExperiences.length >= 10) {
			setErrorMsg("Maximum of 10 work experiences allowed (Data.md limit).");
			return;
		}
		setWorkExperiences([
			...workExperiences,
			{
				companyName: "",
				jobTitle: "",
				startDate: "",
				endDate: "",
				isCurrentJob: false,
				description: "",
			},
		]);
	};

	const handleRemoveWorkExperience = (idx: number) => {
		setWorkExperiences(workExperiences.filter((_, i) => i !== idx));
	};

	// --- Project Handlers ---
	const handleAddProject = () => {
		setProjects([
			...projects,
			{
				projectName: "",
				description: "",
				startDate: "",
				endDate: "",
				isOngoing: false,
				projectLinks: [],
			},
		]);
	};

	const handleRemoveProject = (idx: number) => {
		setProjects(projects.filter((_, i) => i !== idx));
	};

	const handleAddProjectLink = (projectIdx: number) => {
		const link = (newLinkUrl[projectIdx] || "").trim();
		if (!link) return;
		try {
			new URL(link);
		} catch {
			setErrorMsg("Project link must be a valid URL (e.g. https://github.com/...)");
			return;
		}
		const updated = [...projects];
		updated[projectIdx].projectLinks = [...(updated[projectIdx].projectLinks || []), link];
		setProjects(updated);
		setNewLinkUrl({ ...newLinkUrl, [projectIdx]: "" });
		setErrorMsg(null);
	};

	const handleRemoveProjectLink = (projectIdx: number, linkIdx: number) => {
		const updated = [...projects];
		updated[projectIdx].projectLinks = updated[projectIdx].projectLinks.filter((_, i) => i !== linkIdx);
		setProjects(updated);
	};

	// --- Club Handlers ---
	const handleAddClub = () => {
		setClubs([
			...clubs,
			{
				clubName: "",
				role: "Active Member",
				startDate: "",
				endDate: "",
				isActive: true,
				description: "",
			},
		]);
	};

	const handleRemoveClub = (idx: number) => {
		setClubs(clubs.filter((_, i) => i !== idx));
	};

	// --- Certification Handlers ---
	const handleAddCertification = () => {
		setCertifications([
			...certifications,
			{
				certificationName: "",
				issuer: "",
				issueDate: "",
				expirationDate: "",
				credentialId: "",
				credentialUrl: "",
			},
		]);
	};

	const handleRemoveCertification = (idx: number) => {
		setCertifications(certifications.filter((_, i) => i !== idx));
	};

	// --- Submit Handler ---
	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg(null);
		setSuccessMsg(null);

		// Basic sanity validation
		for (const edu of education) {
			if (!edu.schoolName.trim() || !edu.major.trim() || !edu.startDate) {
				setErrorMsg("Please ensure all education entries have a School Name, Major, and Start Date (YYYY-MM-DD).");
				return;
			}
		}

		for (const exp of workExperiences) {
			if (!exp.companyName.trim() || !exp.jobTitle.trim() || !exp.startDate) {
				setErrorMsg("Please ensure each work experience has Company, Job Title, and Start Date.");
				return;
			}
		}

		for (const proj of projects) {
			if (!proj.projectName.trim() || !proj.startDate) {
				setErrorMsg("Please ensure each project has a Project Name and Start Date.");
				return;
			}
		}

		try {
			await updateResume.mutateAsync({
				status,
				socialLinks,
				education,
				skills,
				workExperiences,
				projects,
				clubs,
				certifications,
			});
		} catch {
			// handled in onError
		}
	};

	if (isLoading) {
		return (
			<div className="p-8 text-center text-white/60 animate-pulse">
				Loading member resume profile...
			</div>
		);
	}

	if (fetchError) {
		return (
			<div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
				Failed to load resume profile: {fetchError.message}
			</div>
		);
	}

	return (
		<div className="mt-12 border-t border-white/20 pt-10 text-white">
			{/* Section Title */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<div>
					<div className="flex items-center gap-3">
						<Sparkles className="w-7 h-7 text-[var(--ieee-dark-yellow)]" />
						<h2 className="text-3xl font-[heading-font] text-[var(--ieee-dark-yellow)]">
							MEMBER RESUME DATABASE PROFILE
						</h2>
					</div>
					<p className="text-sm text-white/70 mt-1 max-w-2xl">
						This portfolio information feeds directly into the UCF IEEE Member Resume Database for verified recruiters and corporate sponsors.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs px-2.5 py-1 rounded bg-[var(--ieee-dark-yellow)]/20 text-[var(--ieee-dark-yellow)] font-mono border border-[var(--ieee-dark-yellow)]/40">
						Data.md Verified
					</span>
				</div>
			</div>

			{/* Resume PDF Upload (Integrated) */}
			<div className="mb-10 p-5 rounded-lg bg-white/5 border border-white/10">
				<ResumeUpload />
			</div>

			<form onSubmit={handleSave} className="space-y-10">
				{/* Notifications */}
				{errorMsg && (
					<div className="p-4 bg-red-900/40 border border-red-500 rounded-lg text-white flex items-center gap-3">
						<AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
						<span className="text-sm">{errorMsg}</span>
					</div>
				)}
				{successMsg && (
					<div className="p-4 bg-emerald-900/40 border border-emerald-500 rounded-lg text-white flex items-center gap-3">
						<Check className="w-5 h-5 text-emerald-400 shrink-0" />
						<span className="text-sm">{successMsg}</span>
					</div>
				)}

				{/* 1. Career Search Status */}
				<div className="p-6 rounded-lg bg-white/5 border border-white/10">
					<h3 className="text-xl font-[heading-font] text-white mb-2 flex items-center gap-2">
						<Briefcase className="w-5 h-5 text-[var(--ieee-dark-yellow)]" />
						CAREER SEARCH STATUS
					</h3>
					<p className="text-xs text-white/60 mb-4">Indicate your current employment / internship search objective.</p>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{(["Seeking Internship", "Seeking Full-time", "Employed"] as const).map((opt) => (
							<button
								key={opt}
								type="button"
								onClick={() => setStatus(opt)}
								className={`py-3 px-4 rounded-md border text-sm font-medium transition-all text-center cursor-pointer ${
									status === opt
										? "bg-[var(--ieee-dark-yellow)] text-black font-semibold border-[var(--ieee-dark-yellow)] shadow-md"
										: "bg-black/40 text-white/80 border-white/20 hover:border-white/40"
								}`}
							>
								{opt}
							</button>
						))}
					</div>
				</div>

				{/* 2. Skills (Up to 50, Data.md constraint) */}
				<div className="p-6 rounded-lg bg-white/5 border border-white/10">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
						<h3 className="text-xl font-[heading-font] text-white flex items-center gap-2">
							<Tag className="w-5 h-5 text-[var(--ieee-dark-yellow)]" />
							TECHNICAL SKILLS & TOOLS
						</h3>
						<span className="text-xs text-white/60">
							{skills.length} / 50 skills added
						</span>
					</div>
					<p className="text-xs text-white/60 mb-4">
						Add programming languages, frameworks, hardware design tools, and technologies.
					</p>

					{/* Skill input */}
					<div className="flex gap-2 mb-4">
						<Input
							value={skillInput}
							onChange={(e) => setSkillInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddSkill();
								}
							}}
							placeholder="Type a skill (e.g. React, C++, FPGA) and press Enter"
							className="bg-black/50 border-white/20 text-white"
							maxLength={50}
						/>
						<Button
							type="button"
							onClick={() => handleAddSkill()}
							className="bg-[var(--ieee-dark-yellow)] hover:bg-[var(--ieee-bright-yellow)] text-black cursor-pointer font-semibold"
						>
							<Plus className="w-4 h-4 mr-1" /> Add
						</Button>
					</div>

					{/* Quick-add recommendations */}
					<div className="mb-4">
						<p className="text-xs text-white/50 mb-2">Quick Add Suggestions:</p>
						<div className="flex flex-wrap gap-1.5">
							{COMMON_SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 12).map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									onClick={() => handleAddSkill(suggestion)}
									className="px-2.5 py-1 text-xs rounded bg-white/10 hover:bg-[var(--ieee-dark-yellow)]/20 hover:text-[var(--ieee-dark-yellow)] border border-white/10 transition-colors cursor-pointer"
								>
									+ {suggestion}
								</button>
							))}
						</div>
					</div>

					{/* Added skills chips */}
					<div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-md bg-black/40 border border-white/10">
						{skills.length === 0 ? (
							<span className="text-xs text-white/40 italic">No skills added yet. Type or pick from above!</span>
						) : (
							skills.map((skill, idx) => (
								<span
									key={`${skill}-${idx}`}
									className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-[var(--ieee-dark-yellow)]/20 border border-[var(--ieee-dark-yellow)]/50 text-[var(--ieee-dark-yellow)] font-medium"
								>
									{skill}
									<button
										type="button"
										onClick={() => handleRemoveSkill(idx)}
										className="hover:text-red-400 cursor-pointer ml-1 p-0.5 rounded-full hover:bg-white/10"
										title="Remove skill"
									>
										×
									</button>
								</span>
							))
						)}
					</div>
				</div>

				{/* 3. Education Entries */}
				<div className="p-6 rounded-lg bg-white/5 border border-white/10">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-xl font-[heading-font] text-white flex items-center gap-2">
							<GraduationCap className="w-5 h-5 text-[var(--ieee-dark-yellow)]" />
							EDUCATION
						</h3>
						<Button
							type="button"
							onClick={handleAddEducation}
							className="bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
						>
							<Plus className="w-4 h-4 mr-1" /> Add School
						</Button>
					</div>

					<div className="space-y-4">
						{education.map((edu, idx) => (
							<div key={idx} className="p-4 rounded-lg bg-black/50 border border-white/10 relative space-y-3">
								<div className="flex justify-between items-center border-b border-white/10 pb-2">
									<span className="text-xs font-mono text-[var(--ieee-dark-yellow)]">
										Education #{idx + 1}
									</span>
									{education.length > 1 && (
										<button
											type="button"
											onClick={() => handleRemoveEducation(idx)}
											className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
										>
											<Trash2 className="w-3.5 h-3.5" /> Remove
										</button>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<Field>
										<FieldLabel className="text-xs">School Name</FieldLabel>
										<Input
											value={edu.schoolName}
											onChange={(e) => {
												const updated = [...education];
												updated[idx].schoolName = e.target.value;
												setEducation(updated);
											}}
											placeholder="University of Central Florida"
											className="bg-black/60 border-white/20 text-sm"
										/>
									</Field>
									<Field>
										<FieldLabel className="text-xs">Degree Type</FieldLabel>
										<Input
											value={edu.degreeType}
											onChange={(e) => {
												const updated = [...education];
												updated[idx].degreeType = e.target.value;
												setEducation(updated);
											}}
											placeholder="Bachelor of Science"
											className="bg-black/60 border-white/20 text-sm"
										/>
									</Field>
									<Field>
										<FieldLabel className="text-xs">Major</FieldLabel>
										<Input
											value={edu.major}
											onChange={(e) => {
												const updated = [...education];
												updated[idx].major = e.target.value;
												setEducation(updated);
											}}
											placeholder="Computer Science"
											className="bg-black/60 border-white/20 text-sm"
										/>
									</Field>
									<div className="grid grid-cols-2 gap-2">
										<Field>
											<FieldLabel className="text-xs">GPA (Optional)</FieldLabel>
											<Input
												type="number"
												step="0.01"
												value={edu.gpa ?? ""}
												onChange={(e) => {
													const updated = [...education];
													updated[idx].gpa = e.target.value ? parseFloat(e.target.value) : undefined;
													setEducation(updated);
												}}
												placeholder="3.85"
												className="bg-black/60 border-white/20 text-sm"
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Scale</FieldLabel>
											<Input
												type="number"
												step="0.1"
												value={edu.gpaScale ?? 4.0}
												onChange={(e) => {
													const updated = [...education];
													updated[idx].gpaScale = e.target.value ? parseFloat(e.target.value) : 4.0;
													setEducation(updated);
												}}
												placeholder="4.0"
												className="bg-black/60 border-white/20 text-sm"
											/>
										</Field>
									</div>
									<Field>
										<FieldLabel className="text-xs">Start Date (YYYY-MM-DD)</FieldLabel>
										<Input
											type="date"
											value={edu.startDate}
											onChange={(e) => {
												const updated = [...education];
												updated[idx].startDate = e.target.value;
												setEducation(updated);
											}}
											className="bg-black/60 border-white/20 text-sm"
										/>
									</Field>
									<Field>
										<FieldLabel className="text-xs">End Date / Expected (YYYY-MM-DD)</FieldLabel>
										<Input
											type="date"
											value={edu.endDate || ""}
											disabled={edu.isCurrent}
											onChange={(e) => {
												const updated = [...education];
												updated[idx].endDate = e.target.value;
												setEducation(updated);
											}}
											className="bg-black/60 border-white/20 text-sm disabled:opacity-50"
										/>
									</Field>
								</div>

								<div className="flex items-center gap-2 pt-1">
									<input
										type="checkbox"
										id={`edu-curr-${idx}`}
										checked={edu.isCurrent}
										onChange={(e) => {
											const updated = [...education];
											updated[idx].isCurrent = e.target.checked;
											if (e.target.checked) updated[idx].endDate = "";
											setEducation(updated);
										}}
										className="rounded border-white/20 bg-black text-[var(--ieee-dark-yellow)] cursor-pointer"
									/>
									<label htmlFor={`edu-curr-${idx}`} className="text-xs text-white/80 cursor-pointer">
										Currently Enrolled
									</label>
								</div>

								<Field>
									<FieldLabel className="text-xs">Notes / Honors / Relevant Coursework (Max 500 chars)</FieldLabel>
									<textarea
										value={edu.description || ""}
										maxLength={500}
										onChange={(e) => {
											const updated = [...education];
											updated[idx].description = e.target.value;
											setEducation(updated);
										}}
										placeholder="Dean's Honor List, Burnett Honors College, specialized concentrations..."
										className="w-full min-h-[60px] p-2.5 rounded-md bg-black/60 border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[var(--ieee-dark-yellow)]"
									/>
								</Field>
							</div>
						))}
					</div>
				</div>

				{/* 4. Work Experience (Up to 10 entries) */}
				<div className="p-6 rounded-lg bg-white/5 border border-white/10">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="text-xl font-[heading-font] text-white flex items-center gap-2">
								<Briefcase className="w-5 h-5 text-[var(--ieee-dark-yellow)]" />
								WORK EXPERIENCE
							</h3>
							<p className="text-xs text-white/60">Internships, research assistantships, and professional roles (Up to 10 entries).</p>
						</div>
						<Button
							type="button"
							onClick={handleAddWorkExperience}
							disabled={workExperiences.length >= 10}
							className="bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer disabled:opacity-40"
						>
							<Plus className="w-4 h-4 mr-1" /> Add Experience
						</Button>
					</div>

					{workExperiences.length === 0 ? (
						<div className="p-6 rounded-lg bg-black/30 border border-dashed border-white/15 text-center text-xs text-white/50">
							No work experience listed yet. Click &quot;Add Experience&quot; to showcase your internships and roles.
						</div>
					) : (
						<div className="space-y-4">
							{workExperiences.map((exp, idx) => (
								<div key={idx} className="p-4 rounded-lg bg-black/50 border border-white/10 relative space-y-3">
									<div className="flex justify-between items-center border-b border-white/10 pb-2">
										<span className="text-xs font-mono text-[var(--ieee-dark-yellow)]">
											Experience #{idx + 1}
										</span>
										<button
											type="button"
											onClick={() => handleRemoveWorkExperience(idx)}
											className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
										>
											<Trash2 className="w-3.5 h-3.5" /> Remove
										</button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<Field>
											<FieldLabel className="text-xs">Company Name</FieldLabel>
											<Input
												value={exp.companyName}
												onChange={(e) => {
													const updated = [...workExperiences];
													updated[idx].companyName = e.target.value;
													setWorkExperiences(updated);
												}}
												placeholder="Lockheed Martin, Siemens, UCF IT..."
												className="bg-black/60 border-white/20 text-sm"
												maxLength={100}
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Job Title</FieldLabel>
											<Input
												value={exp.jobTitle}
												onChange={(e) => {
													const updated = [...workExperiences];
													updated[idx].jobTitle = e.target.value;
													setWorkExperiences(updated);
												}}
												placeholder="Software Engineering Intern"
												className="bg-black/60 border-white/20 text-sm"
												maxLength={100}
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Start Date (YYYY-MM-DD)</FieldLabel>
											<Input
												type="date"
												value={exp.startDate}
												onChange={(e) => {
													const updated = [...workExperiences];
													updated[idx].startDate = e.target.value;
													setWorkExperiences(updated);
												}}
												className="bg-black/60 border-white/20 text-sm"
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">End Date (YYYY-MM-DD)</FieldLabel>
											<Input
												type="date"
												value={exp.endDate || ""}
												disabled={exp.isCurrentJob}
												onChange={(e) => {
													const updated = [...workExperiences];
													updated[idx].endDate = e.target.value;
													setWorkExperiences(updated);
												}}
												className="bg-black/60 border-white/20 text-sm disabled:opacity-50"
											/>
										</Field>
									</div>

									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											id={`work-curr-${idx}`}
											checked={exp.isCurrentJob}
											onChange={(e) => {
												const updated = [...workExperiences];
												updated[idx].isCurrentJob = e.target.checked;
												if (e.target.checked) updated[idx].endDate = "";
												setWorkExperiences(updated);
											}}
											className="rounded border-white/20 bg-black text-[var(--ieee-dark-yellow)] cursor-pointer"
										/>
										<label htmlFor={`work-curr-${idx}`} className="text-xs text-white/80 cursor-pointer">
											I currently work here
										</label>
									</div>

									<Field>
										<FieldLabel className="text-xs">Description & Key Achievements (Max 1000 chars)</FieldLabel>
										<textarea
											value={exp.description}
											maxLength={1000}
											onChange={(e) => {
												const updated = [...workExperiences];
												updated[idx].description = e.target.value;
												setWorkExperiences(updated);
											}}
											placeholder="• Developed automated testing pipelines using Python and Docker...&#10;• Designed high-frequency PCB schematics in Altium Designer..."
											className="w-full min-h-[80px] p-2.5 rounded-md bg-black/60 border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[var(--ieee-dark-yellow)]"
										/>
									</Field>
								</div>
							))}
						</div>
					)}
				</div>

				{/* 5. Projects */}
				<div className="p-6 rounded-lg bg-white/5 border border-white/10">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="text-xl font-[heading-font] text-white flex items-center gap-2">
								<FolderGit2 className="w-5 h-5 text-[var(--ieee-dark-yellow)]" />
								TECHNICAL PROJECTS
							</h3>
							<p className="text-xs text-white/60">Hardware, software, robotics, and capstone engineering projects.</p>
						</div>
						<Button
							type="button"
							onClick={handleAddProject}
							className="bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
						>
							<Plus className="w-4 h-4 mr-1" /> Add Project
						</Button>
					</div>

					{projects.length === 0 ? (
						<div className="p-6 rounded-lg bg-black/30 border border-dashed border-white/15 text-center text-xs text-white/50">
							No projects listed yet. Click &quot;Add Project&quot; to show off your GitHub repos and builds.
						</div>
					) : (
						<div className="space-y-4">
							{projects.map((proj, idx) => (
								<div key={idx} className="p-4 rounded-lg bg-black/50 border border-white/10 relative space-y-3">
									<div className="flex justify-between items-center border-b border-white/10 pb-2">
										<span className="text-xs font-mono text-[var(--ieee-dark-yellow)]">
											Project #{idx + 1}
										</span>
										<button
											type="button"
											onClick={() => handleRemoveProject(idx)}
											className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
										>
											<Trash2 className="w-3.5 h-3.5" /> Remove
										</button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<Field className="md:col-span-2">
											<FieldLabel className="text-xs">Project Name</FieldLabel>
											<Input
												value={proj.projectName}
												onChange={(e) => {
													const updated = [...projects];
													updated[idx].projectName = e.target.value;
													setProjects(updated);
												}}
												placeholder="KnightOS Autonomous Rover, Solar Car Telemetry..."
												className="bg-black/60 border-white/20 text-sm"
												maxLength={100}
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Start Date (YYYY-MM-DD)</FieldLabel>
											<Input
												type="date"
												value={proj.startDate}
												onChange={(e) => {
													const updated = [...projects];
													updated[idx].startDate = e.target.value;
													setProjects(updated);
												}}
												className="bg-black/60 border-white/20 text-sm"
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">End Date (YYYY-MM-DD)</FieldLabel>
											<Input
												type="date"
												value={proj.endDate || ""}
												disabled={proj.isOngoing}
												onChange={(e) => {
													const updated = [...projects];
													updated[idx].endDate = e.target.value;
													setProjects(updated);
												}}
												className="bg-black/60 border-white/20 text-sm disabled:opacity-50"
											/>
										</Field>
									</div>

									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											id={`proj-ongoing-${idx}`}
											checked={proj.isOngoing}
											onChange={(e) => {
												const updated = [...projects];
												updated[idx].isOngoing = e.target.checked;
												if (e.target.checked) updated[idx].endDate = "";
												setProjects(updated);
											}}
											className="rounded border-white/20 bg-black text-[var(--ieee-dark-yellow)] cursor-pointer"
										/>
										<label htmlFor={`proj-ongoing-${idx}`} className="text-xs text-white/80 cursor-pointer">
											Ongoing Project
										</label>
									</div>

									<Field>
										<FieldLabel className="text-xs">Description (Max 1000 chars)</FieldLabel>
										<textarea
											value={proj.description}
											maxLength={1000}
											onChange={(e) => {
												const updated = [...projects];
												updated[idx].description = e.target.value;
												setProjects(updated);
											}}
											placeholder="Implemented real-time sensor processing with STM32 and ROS2..."
											className="w-full min-h-[70px] p-2.5 rounded-md bg-black/60 border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[var(--ieee-dark-yellow)]"
										/>
									</Field>

									{/* Project Links */}
									<div className="space-y-2 pt-1">
										<FieldLabel className="text-xs">Project Links (GitHub, Devpost, Live Demo)</FieldLabel>
										<div className="flex gap-2">
											<Input
												value={newLinkUrl[idx] || ""}
												onChange={(e) => setNewLinkUrl({ ...newLinkUrl, [idx]: e.target.value })}
												placeholder="https://github.com/yourname/project"
												className="bg-black/60 border-white/20 text-xs"
											/>
											<Button
												type="button"
												onClick={() => handleAddProjectLink(idx)}
												className="bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
											>
												Add Link
											</Button>
										</div>
										<div className="flex flex-wrap gap-2 pt-1">
											{(proj.projectLinks || []).map((link, linkIdx) => (
												<span
													key={linkIdx}
													className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-white/10 text-white/90 border border-white/10"
												>
													<ExternalLink className="w-3 h-3 text-[var(--ieee-dark-yellow)]" />
													<a href={link} target="_blank" rel="noreferrer" className="underline truncate max-w-[200px]">
														{link}
													</a>
													<button
														type="button"
														onClick={() => handleRemoveProjectLink(idx, linkIdx)}
														className="text-white/40 hover:text-red-400 ml-1 cursor-pointer"
													>
														×
													</button>
												</span>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* 6. Clubs & Extracurricular Activities */}
				<div className="p-6 rounded-lg bg-white/5 border border-white/10">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="text-xl font-[heading-font] text-white flex items-center gap-2">
								<Users className="w-5 h-5 text-[var(--ieee-dark-yellow)]" />
								STUDENT CHAPTERS & CLUBS
							</h3>
							<p className="text-xs text-white/60">Collegiate organizations (IEEE, ACM, Hack@UCF, AIAA, etc.).</p>
						</div>
						<Button
							type="button"
							onClick={handleAddClub}
							className="bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
						>
							<Plus className="w-4 h-4 mr-1" /> Add Club
						</Button>
					</div>

					{clubs.length === 0 ? (
						<div className="p-6 rounded-lg bg-black/30 border border-dashed border-white/15 text-center text-xs text-white/50">
							No club memberships added yet.
						</div>
					) : (
						<div className="space-y-4">
							{clubs.map((club, idx) => (
								<div key={idx} className="p-4 rounded-lg bg-black/50 border border-white/10 relative space-y-3">
									<div className="flex justify-between items-center border-b border-white/10 pb-2">
										<span className="text-xs font-mono text-[var(--ieee-dark-yellow)]">
											Club #{idx + 1}
										</span>
										<button
											type="button"
											onClick={() => handleRemoveClub(idx)}
											className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
										>
											<Trash2 className="w-3.5 h-3.5" /> Remove
										</button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<Field>
											<FieldLabel className="text-xs">Club Name</FieldLabel>
											<Input
												value={club.clubName}
												onChange={(e) => {
													const updated = [...clubs];
													updated[idx].clubName = e.target.value;
													setClubs(updated);
												}}
												placeholder="IEEE UCF Student Branch"
												className="bg-black/60 border-white/20 text-sm"
												maxLength={100}
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Role / Title</FieldLabel>
											<Input
												value={club.role}
												onChange={(e) => {
													const updated = [...clubs];
													updated[idx].role = e.target.value;
													setClubs(updated);
												}}
												placeholder="Active Member, Hardware Committee Lead..."
												className="bg-black/60 border-white/20 text-sm"
												maxLength={100}
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Start Date (YYYY-MM-DD)</FieldLabel>
											<Input
												type="date"
												value={club.startDate}
												onChange={(e) => {
													const updated = [...clubs];
													updated[idx].startDate = e.target.value;
													setClubs(updated);
												}}
												className="bg-black/60 border-white/20 text-sm"
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">End Date (YYYY-MM-DD)</FieldLabel>
											<Input
												type="date"
												value={club.endDate || ""}
												disabled={club.isActive}
												onChange={(e) => {
													const updated = [...clubs];
													updated[idx].endDate = e.target.value;
													setClubs(updated);
												}}
												className="bg-black/60 border-white/20 text-sm disabled:opacity-50"
											/>
										</Field>
									</div>

									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											id={`club-active-${idx}`}
											checked={club.isActive}
											onChange={(e) => {
												const updated = [...clubs];
												updated[idx].isActive = e.target.checked;
												if (e.target.checked) updated[idx].endDate = "";
												setClubs(updated);
											}}
											className="rounded border-white/20 bg-black text-[var(--ieee-dark-yellow)] cursor-pointer"
										/>
										<label htmlFor={`club-active-${idx}`} className="text-xs text-white/80 cursor-pointer">
											Active Member / Leader
										</label>
									</div>

									<Field>
										<FieldLabel className="text-xs">Description (Max 500 chars)</FieldLabel>
										<textarea
											value={club.description}
											maxLength={500}
											onChange={(e) => {
												const updated = [...clubs];
												updated[idx].description = e.target.value;
												setClubs(updated);
											}}
											placeholder="Organized hardware workshops and mentored underclassmen in circuit design..."
											className="w-full min-h-[60px] p-2.5 rounded-md bg-black/60 border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[var(--ieee-dark-yellow)]"
										/>
									</Field>
								</div>
							))}
						</div>
					)}
				</div>

				{/* 7. Certifications & Credentials */}
				<div className="p-6 rounded-lg bg-white/5 border border-white/10">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="text-xl font-[heading-font] text-white flex items-center gap-2">
								<Award className="w-5 h-5 text-[var(--ieee-dark-yellow)]" />
								CERTIFICATIONS & CREDENTIALS
							</h3>
							<p className="text-xs text-white/60">Professional certificates, industry licenses, and cloud certifications.</p>
						</div>
						<Button
							type="button"
							onClick={handleAddCertification}
							className="bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
						>
							<Plus className="w-4 h-4 mr-1" /> Add Certification
						</Button>
					</div>

					{certifications.length === 0 ? (
						<div className="p-6 rounded-lg bg-black/30 border border-dashed border-white/15 text-center text-xs text-white/50">
							No certifications listed yet.
						</div>
					) : (
						<div className="space-y-4">
							{certifications.map((cert, idx) => (
								<div key={idx} className="p-4 rounded-lg bg-black/50 border border-white/10 relative space-y-3">
									<div className="flex justify-between items-center border-b border-white/10 pb-2">
										<span className="text-xs font-mono text-[var(--ieee-dark-yellow)]">
											Certification #{idx + 1}
										</span>
										<button
											type="button"
											onClick={() => handleRemoveCertification(idx)}
											className="text-white/40 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
										>
											<Trash2 className="w-3.5 h-3.5" /> Remove
										</button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<Field>
											<FieldLabel className="text-xs">Certification Name</FieldLabel>
											<Input
												value={cert.certificationName}
												onChange={(e) => {
													const updated = [...certifications];
													updated[idx].certificationName = e.target.value;
													setCertifications(updated);
												}}
												placeholder="CompTIA Security+, AWS Solutions Architect..."
												className="bg-black/60 border-white/20 text-sm"
												maxLength={100}
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Issuing Organization</FieldLabel>
											<Input
												value={cert.issuer}
												onChange={(e) => {
													const updated = [...certifications];
													updated[idx].issuer = e.target.value;
													setCertifications(updated);
												}}
												placeholder="CompTIA, Amazon Web Services, Cisco..."
												className="bg-black/60 border-white/20 text-sm"
												maxLength={100}
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Issue Date (YYYY-MM-DD)</FieldLabel>
											<Input
												type="date"
												value={cert.issueDate}
												onChange={(e) => {
													const updated = [...certifications];
													updated[idx].issueDate = e.target.value;
													setCertifications(updated);
												}}
												className="bg-black/60 border-white/20 text-sm"
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Expiration Date (Optional)</FieldLabel>
											<Input
												type="date"
												value={cert.expirationDate || ""}
												onChange={(e) => {
													const updated = [...certifications];
													updated[idx].expirationDate = e.target.value;
													setCertifications(updated);
												}}
												className="bg-black/60 border-white/20 text-sm"
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Credential ID (Optional)</FieldLabel>
											<Input
												value={cert.credentialId || ""}
												onChange={(e) => {
													const updated = [...certifications];
													updated[idx].credentialId = e.target.value;
													setCertifications(updated);
												}}
												placeholder="ABCD-1234-EFGH"
												className="bg-black/60 border-white/20 text-sm"
												maxLength={100}
											/>
										</Field>
										<Field>
											<FieldLabel className="text-xs">Credential Verification URL (Optional)</FieldLabel>
											<Input
												value={cert.credentialUrl || ""}
												onChange={(e) => {
													const updated = [...certifications];
													updated[idx].credentialUrl = e.target.value;
													setCertifications(updated);
												}}
												placeholder="https://www.credly.com/badges/..."
												className="bg-black/60 border-white/20 text-sm"
											/>
										</Field>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Save Section */}
				<div className="flex flex-col sm:flex-row gap-4 pt-4">
					<Button
						type="submit"
						disabled={updateResume.isPending}
						className="flex-1 bg-[var(--ieee-dark-yellow)] hover:bg-[var(--ieee-bright-yellow)] text-black font-[heading-font] py-6 text-base cursor-pointer transition-all hover:scale-[1.01]"
					>
						{updateResume.isPending ? "SAVING RESUME PROFILE..." : "SAVE RESUME PROFILE"}
					</Button>
				</div>
			</form>
		</div>
	);
}
