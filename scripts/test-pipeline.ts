import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function runPipelineTest() {
	const { db } = await import("../src/lib/database/client");
	const { Members, Resumes } = await import("../src/lib/database/schema");
	const { eq, sql } = await import("drizzle-orm");
	console.log("\n========================================================");
	console.log("   MEMBER RESUME DATABASE PIPELINE VERIFICATION TEST    ");
	console.log("========================================================\n");

	const TEST_EMAIL = "pipeline-test@knights.ucf.edu";
	const TEST_PERSONAL_EMAIL = "pipeline-test@example.com";

	console.log("[1/4] Checking database connection...");

	// 1. Find or create test member in Members table
	let [existingMember] = await db
		.select()
		.from(Members)
		.where(eq(Members.ucfEmail, TEST_EMAIL))
		.limit(1);

	if (!existingMember) {
		console.log("[2/4] Inserting test member record into Members table...");
		const [newMember] = await db
			.insert(Members)
			.values({
				firstName: "Alex",
				lastName: "Rivera",
				ucfEmail: TEST_EMAIL,
				personalEmail: TEST_PERSONAL_EMAIL,
				major: "Computer Engineering (BSCpE)",
				graduationYear: 2026,
				gender: "M",
				dateOfBirth: "2003-05-15",
				biography: "Robotics engineer specializing in autonomous systems, embedded firmware, and real-time sensor processing.",
				active: true,
				officerStatus: false,
				administrator: false,
				duesPaid: true,
				linkedinURL: "https://linkedin.com/in/alex-rivera-ucf",
				githubURL: "https://github.com/alex-rivera",
				websiteURL: "https://alexrivera.dev",
			})
			.returning();
		existingMember = newMember;
		console.log(`      ✓ Created test member ID: ${existingMember.id}`);
	} else {
		console.log(`[2/4] Found existing test member ID: ${existingMember.id}`);
	}

	const memberId = existingMember.id;

	// 2. Upsert comprehensive Data.md portfolio into Resumes table
	console.log("[3/4] Upserting 1-to-1 resume profile into Resumes table (JSONB collections)...");
	const [upsertedResume] = await db
		.insert(Resumes)
		.values({
			memberId,
			status: "Seeking Full-time",
			skills: ["ROS2", "C++", "Python", "Embedded C", "STM32", "Docker", "Git", "FreeRTOS", "Altium Designer"],
			education: [
				{
					schoolName: "University of Central Florida",
					degreeType: "Bachelor of Science",
					major: "Computer Engineering",
					gpa: 3.88,
					gpaScale: 4.0,
					startDate: "2022-08-22",
					endDate: "2026-05-02",
					isCurrent: true,
					description: "Burnett Honors College scholar. Relevant coursework: Embedded Systems, Robot Kinematics, Linear Circuits.",
				},
			],
			workExperiences: [
				{
					companyName: "Lockheed Martin",
					jobTitle: "Embedded Systems Intern",
					startDate: "2024-05-13",
					endDate: "2024-08-09",
					isCurrentJob: false,
					description: "Developed low-latency telemetry drivers on STM32 microcontrollers. Reduced sensor bus latency by 24% using DMA and FreeRTOS tasks.",
				},
				{
					companyName: "UCF Robotics Club",
					jobTitle: "Firmware Lead",
					startDate: "2023-09-01",
					endDate: "2024-05-01",
					isCurrentJob: false,
					description: "Architected motor control CAN-bus communication firmware for RoboSub competition.",
				},
			],
			projects: [
				{
					projectName: "Autonomous Rover Navigation System",
					startDate: "2024-09-01",
					isOngoing: true,
					description: "Designed custom stereo-vision obstacle avoidance running on NVIDIA Jetson Orin Nano with ROS2 Nav2.",
					projectLinks: ["https://github.com/alex-rivera/autonomous-rover"],
				},
				{
					projectName: "Smart Battery Management System (BMS)",
					startDate: "2023-10-15",
					endDate: "2024-03-20",
					isOngoing: false,
					description: "Engineered a 4-cell Li-ion balancing circuit with I2C battery fuel gauge monitoring.",
					projectLinks: ["https://github.com/alex-rivera/smart-bms"],
				},
			],
			clubs: [
				{
					clubName: "IEEE UCF Student Branch",
					role: "Hardware Committee Chair",
					startDate: "2023-01-10",
					isActive: true,
					description: "Lead weekly PCB design workshops in Altium Designer for 60+ engineering members.",
				},
			],
			certifications: [
				{
					certificationName: "Certified ROS2 Developer",
					issuer: "Open Robotics",
					issueDate: "2024-02-15",
					credentialId: "ROS2-DEV-9812",
					credentialUrl: "https://credentials.openrobotics.org/verify/ROS2-DEV-9812",
				},
			],
			socialLinks: [
				{ platformName: "GitHub", profileUrl: "https://github.com/alex-rivera" },
				{ platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/alex-rivera-ucf" },
				{ platformName: "Portfolio", profileUrl: "https://alexrivera.dev" },
			],
			updatedAt: new Date(),
		})
		.onConflictDoUpdate({
			target: Resumes.memberId,
			set: {
				status: "Seeking Full-time",
				skills: ["ROS2", "C++", "Python", "Embedded C", "STM32", "Docker", "Git", "FreeRTOS", "Altium Designer"],
				education: [
					{
						schoolName: "University of Central Florida",
						degreeType: "Bachelor of Science",
						major: "Computer Engineering",
						gpa: 3.88,
						gpaScale: 4.0,
						startDate: "2022-08-22",
						endDate: "2026-05-02",
						isCurrent: true,
						description: "Burnett Honors College scholar. Relevant coursework: Embedded Systems, Robot Kinematics, Linear Circuits.",
					},
				],
				workExperiences: [
					{
						companyName: "Lockheed Martin",
						jobTitle: "Embedded Systems Intern",
						startDate: "2024-05-13",
						endDate: "2024-08-09",
						isCurrentJob: false,
						description: "Developed low-latency telemetry drivers on STM32 microcontrollers. Reduced sensor bus latency by 24% using DMA and FreeRTOS tasks.",
					},
					{
						companyName: "UCF Robotics Club",
						jobTitle: "Firmware Lead",
						startDate: "2023-09-01",
						endDate: "2024-05-01",
						isCurrentJob: false,
						description: "Architected motor control CAN-bus communication firmware for RoboSub competition.",
					},
				],
				projects: [
					{
						projectName: "Autonomous Rover Navigation System",
						startDate: "2024-09-01",
						isOngoing: true,
						description: "Designed custom stereo-vision obstacle avoidance running on NVIDIA Jetson Orin Nano with ROS2 Nav2.",
						projectLinks: ["https://github.com/alex-rivera/autonomous-rover"],
					},
					{
						projectName: "Smart Battery Management System (BMS)",
						startDate: "2023-10-15",
						endDate: "2024-03-20",
						isOngoing: false,
						description: "Engineered a 4-cell Li-ion balancing circuit with I2C battery fuel gauge monitoring.",
						projectLinks: ["https://github.com/alex-rivera/smart-bms"],
					},
				],
				clubs: [
					{
						clubName: "IEEE UCF Student Branch",
						role: "Hardware Committee Chair",
						startDate: "2023-01-10",
						isActive: true,
						description: "Lead weekly PCB design workshops in Altium Designer for 60+ engineering members.",
					},
				],
				certifications: [
					{
						certificationName: "Certified ROS2 Developer",
						issuer: "Open Robotics",
						issueDate: "2024-02-15",
						credentialId: "ROS2-DEV-9812",
						credentialUrl: "https://credentials.openrobotics.org/verify/ROS2-DEV-9812",
					},
				],
				socialLinks: [
					{ platformName: "GitHub", profileUrl: "https://github.com/alex-rivera" },
					{ platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/alex-rivera-ucf" },
					{ platformName: "Portfolio", profileUrl: "https://alexrivera.dev" },
				],
				updatedAt: new Date(),
			},
		})
		.returning();

	console.log(`      ✓ Successfully upserted resume record ID: ${upsertedResume.id}`);

	// 3. Test the exact consumption query executed by Member-Resume-Database-MRD
	console.log("[4/4] Executing MRD Consumption Query (LEFT JOIN members + resumes)...");
	const result = await db.execute(sql`
		SELECT 
			m.id,
			m.first_name,
			m.last_name,
			m.personal_email,
			m.ucf_email,
			m.major,
			m.graduation_year,
			r.status,
			r.skills,
			r.education,
			r.work_experiences,
			r.projects,
			r.clubs,
			r.certifications,
			r.social_links
		FROM members m
		LEFT JOIN resumes r ON m.id = r.member_id
		WHERE m.id = ${memberId}
	`);

	const rows = Array.isArray(result) ? result : ((result as any)?.rows || []);
	const candidate = rows[0];

	if (!candidate) {
		throw new Error("Pipeline query failed: candidate row not returned!");
	}

	console.log("\n========================================================");
	console.log("               PIPELINE QUERY RESULTS                   ");
	console.log("========================================================");
	console.log(`Candidate Name    : ${candidate.first_name} ${candidate.last_name}`);
	console.log(`Email             : ${candidate.ucf_email}`);
	console.log(`Major             : ${candidate.major}`);
	console.log(`Career Status     : ${candidate.status}`);
	console.log(`Skills Count      : ${(candidate.skills as any[]).length} skills (${(candidate.skills as any[]).slice(0, 5).join(", ")}...)`);
	console.log(`Education Entries : ${(candidate.education as any[]).length} (${(candidate.education as any[])[0]?.schoolName} - ${(candidate.education as any[])[0]?.degreeType})`);
	console.log(`Work Experiences  : ${(candidate.work_experiences as any[]).length} (${(candidate.work_experiences as any[])[0]?.companyName} - ${(candidate.work_experiences as any[])[0]?.jobTitle})`);
	console.log(`Projects Listed   : ${(candidate.projects as any[]).length} (${(candidate.projects as any[])[0]?.projectName})`);
	console.log(`Clubs Listed      : ${(candidate.clubs as any[]).length} (${(candidate.clubs as any[])[0]?.clubName})`);
	console.log(`Certifications    : ${(candidate.certifications as any[]).length} (${(candidate.certifications as any[])[0]?.certificationName})`);
	console.log("========================================================\n");
	console.log(">>> SUCCESS: The complete write -> join -> read pipeline is 100% verified!");
}

runPipelineTest()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error("\n[Pipeline Error]:", err);
		process.exit(1);
	});
