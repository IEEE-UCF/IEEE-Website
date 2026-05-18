'use client';

import { majorEnums } from '@/lib/database/schema';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

// Middleware at /settings guarantees a valid session — no useEffect redirect needed.

export default function SettingsPage() {
	const { data: session } = useSession();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// formKey forces a full re-mount of the form on cancel, resetting all inputs
	// (including uncontrolled Select components which don't respond to imperative resets)
	const [formKey, setFormKey] = useState(0);

	const utils = trpc.useUtils();

	const { data: memberProfile, isLoading: profileLoading } = trpc.member.getMyProfile.useQuery(
		undefined,
		{ enabled: !!session?.user },
	);

	const updateProfile = trpc.member.updateMyProfile.useMutation({
		onSuccess: () => {
			setSuccess('Profile updated successfully!');
			setIsSubmitting(false);
			void utils.member.getMyProfile.invalidate();
			setTimeout(() => setSuccess(null), 3000);
		},
		onError: (err) => {
			setError(err.message ?? 'Failed to update profile');
			setIsSubmitting(false);
		},
	});

	const handleSignOut = async () => {
		await signOut({ callbackUrl: '/' });
	};

	const handleCancel = () => {
		// Re-mount the form so every field resets to its defaultValue from memberProfile
		setFormKey((k) => k + 1);
		setError(null);
		setSuccess(null);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(null);

		const formData = new FormData(e.currentTarget);

		// Safely parse graduation year — don't send NaN
		const gradYearRaw = formData.get('graduation_year') as string;
		const graduationYear = gradYearRaw ? parseInt(gradYearRaw, 10) : undefined;

		// major is required in the schema — guard so we don't send undefined
		const major = formData.get('major') as string;
		if (!major) {
			setError('Please select a major.');
			setIsSubmitting(false);
			return;
		}

		try {
			await updateProfile.mutateAsync({
				firstName: formData.get('first_name') as string,
				middleName: (formData.get('middle_name') as string) || undefined,
				lastName: formData.get('last_name') as string,
				biography: (formData.get('biography') as string) || undefined,
				phoneNumber: formData.get('phone_number') as string,
				major: major as (typeof majorEnums)['enumValues'][number],
				gender: formData.get('gender') as 'M' | 'F' | 'NB' | 'O' | 'PNTS',
				graduationYear,
				linkedinURL: (formData.get('linkedin_url') as string) || undefined,
				githubURL: (formData.get('github_url') as string) || undefined,
				websiteURL: (formData.get('website_url') as string) || undefined,
			});
		} catch {
			// onError above handles the message
		}
	};

	if (profileLoading || !memberProfile) {
		return (
			<div className="flex justify-center min-h-screen items-center bg-ieee-black [background:radial-gradient(125%_125%_at_50%_10%,var(--color-ieee-near-black)_40%,var(--color-ieee-dark-yellow)_100%)]" />
		);
	}

	return (
		<div className="flex flex-col justify-center min-h-screen items-center w-screen bg-ieee-black">
			<div className="py-30 bg-ieee-black w-full">
				<div className="absolute z-100 w-full h-fit inset-0 items-center px-5">
					<Navbar />
				</div>

				<div className="relative mx-auto flex max-w-5xl flex-col rounded-lg border border-ieee-dark-grey bg-ieee-near-black lg:p-10 p-5 shadow-lg">
					<div className="absolute inset-0 bg-ieee-black opacity-70 blur-3xl rounded-lg pointer-events-none" />
					<div className="relative z-10 max-h-full">
						{/* formKey re-mounts the entire form on cancel, resetting all fields */}
						<form key={formKey} onSubmit={handleSubmit} className="flex flex-col">
							<FieldGroup className="text-white">
								<FieldSet>
									{/* Header */}
									<div className="flex justify-between items-center mb-6">
										<h1 className="text-5xl font-heading text-ieee-dark-yellow">
											SETTINGS
										</h1>
									</div>

									{error && (
										<div className="mb-4 rounded-md border border-red-800 bg-red-950 p-3 text-red-400">
											{error}
										</div>
									)}
									{success && (
										<div className="mb-4 rounded-md border border-ieee-dark-yellow/40 bg-ieee-dark-yellow/10 p-3 text-ieee-dark-yellow">
											{success}
										</div>
									)}

									{/* Membership info (read-only) */}
									<div className="mb-6">
										<h2 className="text-2xl font-heading mb-4 border-b border-ieee-dark-grey pb-2 text-white">
											MEMBERSHIP INFORMATION
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-ieee-dark-yellow">
											<div>
												<p className="text-sm font-heading">
													Officer Status
												</p>
												<p className="text-white">
													{memberProfile.officerStatus ? 'Yes' : 'No'}
												</p>
											</div>
											<div>
												<p className="text-sm font-heading">Dues Paid</p>
												<p className="text-white">
													{memberProfile.duesPaid ? 'Yes' : 'No'}
												</p>
											</div>
											<div>
												<p className="text-sm font-heading">UCF Email</p>
												<p className="text-white">
													{memberProfile.ucfEmail}
												</p>
											</div>
											<div>
												<p className="text-sm font-heading">
													Personal Email
												</p>
												<p className="text-white">
													{memberProfile.personalEmail}
												</p>
											</div>
										</div>
									</div>

									{/* Linked Discord */}
									<div className="text-ieee-dark-yellow font-heading flex-row flex gap-2 text-sm items-center">
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
										</svg>
										Linked Discord Account
									</div>
									<div className="mb-6 flex items-center rounded-md border border-ieee-dark-yellow/40 bg-ieee-dark-yellow/10 p-4 text-ieee-dark-yellow">
										{session?.user?.image && (
											<img
												src={session.user.image}
												alt={`${session.user.name ?? 'Member'} Discord avatar`}
												className="w-12 h-12 rounded-full mr-4"
											/>
										)}
										<div>
											<div className="text-lg font-heading text-white">
												{session?.user?.name}
											</div>
											<div className="text-sm font-body text-ieee-light-grey">
												{session?.user?.email}
											</div>
										</div>
									</div>

									{/* Basic information */}
									<div className="mb-6">
										<h2 className="text-2xl font-heading mb-4 border-b border-ieee-dark-grey pb-2">
											BASIC INFORMATION
										</h2>
										<FieldGroup className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<Field>
													<FieldLabel htmlFor="first_name">
														First Name
													</FieldLabel>
													<Input
														id="first_name"
														name="first_name"
														defaultValue={memberProfile.firstName}
														placeholder="First Name"
														required
													/>
												</Field>
												<Field>
													<FieldLabel htmlFor="last_name">
														Last Name
													</FieldLabel>
													<Input
														id="last_name"
														name="last_name"
														defaultValue={memberProfile.lastName}
														placeholder="Last Name"
														required
													/>
												</Field>
											</div>
											<Field>
												<FieldLabel htmlFor="middle_name">
													Middle Name
												</FieldLabel>
												<Input
													id="middle_name"
													name="middle_name"
													defaultValue={memberProfile.middleName || ''}
													placeholder="Middle Name (Optional)"
												/>
											</Field>
											<Field>
												<FieldLabel htmlFor="gender">Gender</FieldLabel>
												<Select
													name="gender"
													defaultValue={memberProfile.gender ?? undefined}
													required
												>
													<SelectTrigger id="gender">
														<SelectValue placeholder="Select gender" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="M">Male</SelectItem>
														<SelectItem value="F">Female</SelectItem>
														<SelectItem value="NB">
															Non-Binary
														</SelectItem>
														<SelectItem value="O">Other</SelectItem>
														<SelectItem value="PNTS">
															Prefer Not To Say
														</SelectItem>
													</SelectContent>
												</Select>
											</Field>
											<Field>
												<FieldLabel htmlFor="major">Major</FieldLabel>
												<Select
													name="major"
													defaultValue={memberProfile.major ?? undefined}
													required
												>
													<SelectTrigger id="major">
														<SelectValue placeholder="Select major" />
													</SelectTrigger>
													<SelectContent>
														{majorEnums.enumValues.map((option) => (
															<SelectItem key={option} value={option}>
																{option}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</Field>
											<Field>
												<FieldLabel htmlFor="graduation_year">
													Graduation Year
												</FieldLabel>
												<Input
													id="graduation_year"
													name="graduation_year"
													type="number"
													defaultValue={
														memberProfile.graduationYear ?? ''
													}
													placeholder="2027"
													min="2024"
													max="2035"
												/>
											</Field>
											<Field>
												<FieldLabel htmlFor="phone_number">
													Phone Number
												</FieldLabel>
												<Input
													id="phone_number"
													name="phone_number"
													type="tel"
													defaultValue={memberProfile.phoneNumber || ''}
													placeholder="(407) 123-4567"
													required
												/>
											</Field>
										</FieldGroup>
									</div>

									{/* Biography */}
									<div className="mb-6">
										<h2 className="text-2xl font-heading mb-4 border-b border-ieee-dark-grey pb-2">
											BIOGRAPHY
										</h2>
										<Field>
											<FieldLabel htmlFor="biography">About You</FieldLabel>
											<textarea
												id="biography"
												name="biography"
												defaultValue={memberProfile.biography || ''}
												placeholder="Write a paragraph about your professional background, technical experience, and skills..."
												className="w-full min-h-[120px] rounded-md border border-ieee-grey bg-ieee-dark-grey p-3 font-body text-white placeholder:text-ieee-grey outline-none transition-[border-color,box-shadow] focus:border-ieee-bright-yellow focus:ring-2 focus:ring-ieee-bright-yellow/35 focus:ring-offset-2 focus:ring-offset-ieee-near-black"
											/>
										</Field>
									</div>

									{/* Professional links */}
									<div className="mb-6">
										<h2 className="text-2xl font-heading mb-4 border-b border-ieee-dark-grey pb-2">
											PROFESSIONAL LINKS
										</h2>
										<FieldGroup className="space-y-4">
											<Field>
												<FieldLabel htmlFor="linkedin_url">
													LinkedIn URL
												</FieldLabel>
												<Input
													id="linkedin_url"
													name="linkedin_url"
													type="url"
													defaultValue={memberProfile.linkedinURL || ''}
													placeholder="https://linkedin.com/in/yourprofile"
												/>
											</Field>
											<Field>
												<FieldLabel htmlFor="github_url">
													GitHub URL
												</FieldLabel>
												<Input
													id="github_url"
													name="github_url"
													type="url"
													defaultValue={memberProfile.githubURL || ''}
													placeholder="https://github.com/yourusername"
												/>
											</Field>
											<Field>
												<FieldLabel htmlFor="website_url">
													Personal Website
												</FieldLabel>
												<Input
													id="website_url"
													name="website_url"
													type="url"
													defaultValue={memberProfile.websiteURL || ''}
													placeholder="https://yourwebsite.com"
												/>
											</Field>
										</FieldGroup>
									</div>

									{/* Save / Cancel */}
									<div className="flex gap-4 mt-8 w-full md:w-1/2 self-center">
										<Button
											type="submit"
											size="lg"
											className="flex-1 hover:scale-102 py-6 text-base"
											disabled={isSubmitting}
										>
											{isSubmitting ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
										</Button>
										<Button
											type="button"
											variant="secondary"
											size="lg"
											className="flex-1 hover:scale-102 py-6 text-base"
											onClick={handleCancel}
										>
											CANCEL
										</Button>
									</div>

									{/* Sign Out */}
									<div className="mt-16 pt-8 border-t border-ieee-dark-grey/60 flex justify-center">
										<Button
											type="button"
											variant="destructive"
											size="lg"
											onClick={handleSignOut}
											className="w-full md:w-1/3 hover:scale-102 py-6 text-base"
										>
											SIGN OUT
										</Button>
									</div>
								</FieldSet>
							</FieldGroup>
						</form>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
