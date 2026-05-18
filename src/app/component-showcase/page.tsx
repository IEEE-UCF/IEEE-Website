'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlowButton } from '@/components/ui/glow-button';
import Link from 'next/link';
import { QREventScanner } from '@/components/admin/qr_event_scanner';
import { EventList } from '@/components/dashboard/event-list';
import { FormPopup } from '@/components/dashboard/newEventForm';
import { ThemePlayground } from '@/components/theme-playground';
import { Timer } from '@/components/timer';

export default function ComponentShowcase() {
	const [expandedSection, setExpandedSection] = useState<string | null>('buttons');

	const toggleSection = (section: string) => {
		setExpandedSection(expandedSection === section ? null : section);
	};

	return (
		<div className="bg-ieee-black text-white min-h-screen">
			<ThemePlayground pageName="Component Showcase" />
			{/* Header */}
			<div className="bg-ieee-near-black border-b border-ieee-dark-grey px-6 py-12">
				<div className="max-w-6xl mx-auto">
					<h1 className="font-display text-6xl text-ieee-bright-yellow mb-2">
						Component Showcase
					</h1>
					<p className="font-body text-xl text-ieee-light-grey">
						Interactive examples of all custom components working together with real
						patterns.
					</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-6 py-12">
				{/* Navigation Cards */}
				<section className="mb-16">
					<h2 className="font-heading text-2xl text-ieee-bright-yellow mb-6">
						Jump to Component
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{[
							{ name: 'Buttons & CTAs', id: 'buttons' },
							{ name: 'Cards & Containers', id: 'cards' },
							{ name: 'Forms & Inputs', id: 'forms' },
							{ name: 'Navigation', id: 'navigation' },
							{ name: 'Status & Feedback', id: 'feedback' },
							{ name: 'Complex Patterns', id: 'complex' },
							{ name: 'Custom Components', id: 'custom' },
						].map((item) => (
							<button
								key={item.id}
								onClick={() => toggleSection(item.id)}
								className={`p-4 rounded-lg border transition-all text-left ${
									expandedSection === item.id
										? 'bg-ieee-dark-yellow text-black border-ieee-bright-yellow'
										: 'bg-ieee-near-black border-ieee-dark-grey hover:border-ieee-grey'
								}`}
							>
								<p
									className={`font-heading text-sm ${expandedSection === item.id ? 'text-black' : 'text-white'}`}
								>
									{item.name}
								</p>
							</button>
						))}
					</div>
				</section>

				{/* Buttons & CTAs */}
				{(expandedSection === 'buttons' || expandedSection === null) && (
					<section className="mb-16">
						<div
							onClick={() => toggleSection('buttons')}
							className="flex items-center justify-between cursor-pointer mb-6 p-4 bg-ieee-near-black border border-ieee-dark-grey rounded-lg hover:border-ieee-grey transition-colors"
						>
							<h2 className="font-heading text-2xl text-ieee-bright-yellow">
								Buttons & CTAs
							</h2>
							<span className="text-ieee-light-grey">↓</span>
						</div>

						{expandedSection === 'buttons' && (
							<div className="space-y-6">
								{/* Primary Button Row */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Primary Action Buttons
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										For the single most important action on a page. Use
										sparingly.
									</p>
									<div className="flex flex-wrap gap-3">
										<Button>Register Now</Button>
										<Button>Join IEEE UCF</Button>
										<Button size="lg">Get Started</Button>
										<Button size="sm">Save</Button>
										<Button disabled>Disabled State</Button>
									</div>
								</div>

								{/* Secondary Buttons */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Secondary & Supporting Buttons
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										Cancel, close, or less important actions. Often paired with
										a primary button.
									</p>
									<div className="flex flex-wrap gap-3">
										<Button variant="secondary">Cancel</Button>
										<Button variant="secondary">Close</Button>
										<Button variant="secondary" size="sm">
											Back
										</Button>
										<Button variant="secondary" disabled>
											Disabled
										</Button>
									</div>
								</div>

								{/* Outline & Ghost Buttons */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Outline & Ghost Buttons
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										Low-emphasis actions and icon buttons. Use for filters,
										toggles, and inline actions.
									</p>
									<div className="flex flex-wrap gap-3">
										<Button variant="outline">Hardware</Button>
										<Button variant="outline">Software</Button>
										<Button variant="outline" size="sm">
											Filter
										</Button>
										<Button variant="ghost">View Details</Button>
										<Button variant="ghost" size="icon">
											×
										</Button>
										<Button variant="ghost" disabled>
											Disabled
										</Button>
									</div>
								</div>

								{/* Destructive Button */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Destructive Action
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										For irreversible actions. Requires user confirmation
										mentally.
									</p>
									<div className="flex flex-wrap gap-3">
										<Button variant="destructive">Sign Out</Button>
										<Button variant="destructive" size="sm">
											Delete
										</Button>
										<Button variant="destructive" disabled>
											Disabled
										</Button>
									</div>
								</div>

								{/* GlowButton */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Marquee CTA — GlowButton
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										High-visibility call-to-action with animated glow. Use
										sparingly for hero sections only.
									</p>
									<div className="flex flex-wrap gap-6 items-center">
										<GlowButton>
											<span className="text-white font-heading">
												Get Involved
											</span>
										</GlowButton>
										<GlowButton innerClassName="px-5 py-2">
											<span className="text-white font-heading text-sm">
												LEARN MORE
											</span>
										</GlowButton>
									</div>
								</div>

								{/* Form Action Row Pattern */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Form Action Row Pattern
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										Standard pattern for forms and modals. Primary action on
										right.
									</p>
									<div className="bg-ieee-dark-grey/40 border border-ieee-dark-grey rounded p-4">
										<div className="space-y-4 mb-4">
											<div>
												<label className="block text-sm font-subheading text-ieee-light-grey mb-1">
													Email
												</label>
												<input
													type="email"
													placeholder="you@ucf.edu"
													className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
													           placeholder:text-ieee-grey focus:outline-none focus:border-ieee-bright-yellow"
												/>
											</div>
										</div>
										<div className="flex justify-end gap-2">
											<Button variant="secondary" type="button">
												Cancel
											</Button>
											<Button type="submit">Save Changes</Button>
										</div>
									</div>
								</div>
							</div>
						)}
					</section>
				)}

				{/* Cards & Containers */}
				{(expandedSection === 'cards' || expandedSection === null) && (
					<section className="mb-16">
						<div
							onClick={() => toggleSection('cards')}
							className="flex items-center justify-between cursor-pointer mb-6 p-4 bg-ieee-near-black border border-ieee-dark-grey rounded-lg hover:border-ieee-grey transition-colors"
						>
							<h2 className="font-heading text-2xl text-ieee-bright-yellow">
								Cards & Containers
							</h2>
							<span className="text-ieee-light-grey">↓</span>
						</div>

						{expandedSection === 'cards' && (
							<div className="space-y-6">
								{/* Standard Cards */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
										<h3 className="font-subheading text-lg text-white mb-2">
											Standard Card
										</h3>
										<p className="font-body text-ieee-light-grey text-sm">
											Basic content card with dark background and border. Used
											throughout.
										</p>
									</div>

									<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6 cursor-pointer transition-transform hover:scale-102 hover:border-ieee-grey">
										<h3 className="font-subheading text-lg text-white mb-2">
											Hoverable Card
										</h3>
										<p className="font-body text-ieee-light-grey text-sm">
											Scales on hover for interactive feedback. Hover to see
											effect.
										</p>
									</div>

									<div className="bg-ieee-near-black border-2 border-ieee-bright-yellow rounded-lg p-6">
										<h3 className="font-subheading text-lg text-white mb-2">
											Selected / Active
										</h3>
										<p className="font-body text-ieee-light-grey text-sm">
											Yellow border indicates selection or active state.
										</p>
									</div>

									<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6 cursor-pointer transition-all hover:bg-ieee-dark-grey/50">
										<h3 className="font-subheading text-lg text-white mb-2">
											Subtle Hover
										</h3>
										<p className="font-body text-ieee-light-grey text-sm">
											Darkens slightly on hover. Good for less critical
											interactions.
										</p>
									</div>
								</div>

								{/* Event Card */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Event Card Pattern
									</h3>
									<div className="bg-ieee-dark-grey/40 border border-ieee-dark-grey rounded-lg p-6 space-y-3">
										<h4 className="font-subheading text-xl text-white">
											General Meeting
										</h4>
										<div>
											<p className="font-body text-ieee-light-grey text-sm">
												Engineering Building, Room 101
											</p>
											<p className="font-body text-ieee-grey text-xs mt-1">
												January 15, 2025 • 6:00 PM – 7:30 PM
											</p>
										</div>
										<p className="font-body text-white text-sm">
											Monthly gathering for all IEEE members. Refreshments
											provided.
										</p>
										<Button size="sm" className="w-full">
											Learn More
										</Button>
									</div>
								</div>

								{/* Alert Cards */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">Status Cards</h3>
									<div className="space-y-3">
										<div className="flex items-start gap-3 bg-green-950 border border-green-800 rounded-lg p-4">
											<span className="text-green-400 font-heading">✓</span>
											<div>
												<p className="font-heading text-sm text-green-400">
													Success
												</p>
												<p className="font-body text-xs text-green-300">
													Your event has been created.
												</p>
											</div>
										</div>

										<div className="flex items-start gap-3 bg-red-950 border border-red-800 rounded-lg p-4">
											<span className="text-red-400 font-heading">✕</span>
											<div>
												<p className="font-heading text-sm text-red-400">
													Error
												</p>
												<p className="font-body text-xs text-red-300">
													Failed to save. Please try again.
												</p>
											</div>
										</div>

										<div className="flex items-start gap-3 bg-ieee-dark-yellow/10 border border-ieee-dark-yellow/40 rounded-lg p-4">
											<span className="text-ieee-dark-yellow font-heading">
												!
											</span>
											<div>
												<p className="font-heading text-sm text-ieee-dark-yellow">
													Warning
												</p>
												<p className="font-body text-xs text-ieee-light-grey">
													Dues are required for this event.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</section>
				)}

				{/* Forms & Inputs */}
				{(expandedSection === 'forms' || expandedSection === null) && (
					<section className="mb-16">
						<div
							onClick={() => toggleSection('forms')}
							className="flex items-center justify-between cursor-pointer mb-6 p-4 bg-ieee-near-black border border-ieee-dark-grey rounded-lg hover:border-ieee-grey transition-colors"
						>
							<h2 className="font-heading text-2xl text-ieee-bright-yellow">
								Forms & Inputs
							</h2>
							<span className="text-ieee-light-grey">↓</span>
						</div>

						{expandedSection === 'forms' && (
							<div className="space-y-6">
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">Form Fields</h3>
									<form className="max-w-md space-y-4">
										<div>
											<label className="block text-sm font-subheading text-ieee-light-grey mb-1">
												Full Name
											</label>
											<input
												type="text"
												placeholder="John Doe"
												className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
												           placeholder:text-ieee-grey
												           focus:outline-none focus:border-ieee-bright-yellow focus:ring-1 focus:ring-ieee-bright-yellow
												           transition-colors"
											/>
										</div>

										<div>
											<label className="block text-sm font-subheading text-ieee-light-grey mb-1">
												Email Address
											</label>
											<input
												type="email"
												placeholder="you@ucf.edu"
												className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
												           placeholder:text-ieee-grey
												           focus:outline-none focus:border-ieee-bright-yellow focus:ring-1 focus:ring-ieee-bright-yellow
												           transition-colors"
											/>
										</div>

										<div>
											<label className="block text-sm font-subheading text-ieee-light-grey mb-1">
												Event
											</label>
											<select
												className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
											                  focus:outline-none focus:border-ieee-bright-yellow
											                  transition-colors"
											>
												<option disabled>Select an event</option>
												<option>General Meeting</option>
												<option>Hackathon</option>
												<option>Workshop</option>
											</select>
										</div>

										<div>
											<label className="block text-sm font-subheading text-ieee-light-grey mb-1">
												Tell us about yourself
											</label>
											<textarea
												rows={3}
												placeholder="Your message..."
												className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
												           placeholder:text-ieee-grey
												           focus:outline-none focus:border-ieee-bright-yellow focus:ring-1 focus:ring-ieee-bright-yellow
												           transition-colors resize-none"
											/>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<input
													type="checkbox"
													id="terms"
													className="h-4 w-4 accent-ieee-dark-yellow border-ieee-grey rounded"
												/>
												<label
													htmlFor="terms"
													className="text-sm font-subheading text-ieee-light-grey"
												>
													I agree to the terms
												</label>
											</div>

											<div className="flex items-center gap-2">
												<input
													type="checkbox"
													id="newsletter"
													className="h-4 w-4 accent-ieee-dark-yellow border-ieee-grey rounded"
												/>
												<label
													htmlFor="newsletter"
													className="text-sm font-subheading text-ieee-light-grey"
												>
													Subscribe to our newsletter
												</label>
											</div>
										</div>

										<div className="flex justify-end gap-2 pt-4">
											<Button variant="secondary">Cancel</Button>
											<Button type="submit">Submit</Button>
										</div>
									</form>
								</div>
							</div>
						)}
					</section>
				)}

				{/* Navigation */}
				{(expandedSection === 'navigation' || expandedSection === null) && (
					<section className="mb-16">
						<div
							onClick={() => toggleSection('navigation')}
							className="flex items-center justify-between cursor-pointer mb-6 p-4 bg-ieee-near-black border border-ieee-dark-grey rounded-lg hover:border-ieee-grey transition-colors"
						>
							<h2 className="font-heading text-2xl text-ieee-bright-yellow">
								Navigation
							</h2>
							<span className="text-ieee-light-grey">↓</span>
						</div>

						{expandedSection === 'navigation' && (
							<div className="space-y-6">
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Text Navigation Links
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										Simple text links that turn yellow on hover.
									</p>
									<div className="flex flex-wrap gap-4">
										<Link
											href="/"
											className="font-body text-white hover:text-ieee-bright-yellow transition-colors"
										>
											Home
										</Link>
										<Link
											href="/events"
											className="font-body text-white hover:text-ieee-bright-yellow transition-colors"
										>
											Events
										</Link>
										<Link
											href="/projects"
											className="font-body text-white hover:text-ieee-bright-yellow transition-colors"
										>
											Projects
										</Link>
										<Link
											href="/about"
											className="font-body text-white hover:text-ieee-bright-yellow transition-colors"
										>
											About
										</Link>
									</div>
								</div>

								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Link as Button (asChild)
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										Navigation links that look like buttons. Use with Next.js
										Link.
									</p>
									<div className="flex flex-wrap gap-3">
										<Button asChild>
											<Link href="/">View Home</Link>
										</Button>
										<Button variant="secondary" asChild>
											<Link href="/style-guide">Style Guide</Link>
										</Button>
										<Button variant="outline" asChild>
											<Link href="/events">Browse Events</Link>
										</Button>
									</div>
								</div>

								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Breadcrumb Navigation
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										Hierarchical path showing user location.
									</p>
									<div className="flex items-center gap-2 font-body text-sm">
										<Link
											href="/"
											className="text-white hover:text-ieee-bright-yellow transition-colors"
										>
											Home
										</Link>
										<span className="text-ieee-grey">/</span>
										<Link
											href="/events"
											className="text-white hover:text-ieee-bright-yellow transition-colors"
										>
											Events
										</Link>
										<span className="text-ieee-grey">/</span>
										<span className="text-ieee-light-grey">
											General Meeting
										</span>
									</div>
								</div>
							</div>
						)}
					</section>
				)}

				{/* Status & Feedback */}
				{(expandedSection === 'feedback' || expandedSection === null) && (
					<section className="mb-16">
						<div
							onClick={() => toggleSection('feedback')}
							className="flex items-center justify-between cursor-pointer mb-6 p-4 bg-ieee-near-black border border-ieee-dark-grey rounded-lg hover:border-ieee-grey transition-colors"
						>
							<h2 className="font-heading text-2xl text-ieee-bright-yellow">
								Status & Feedback
							</h2>
							<span className="text-ieee-light-grey">↓</span>
						</div>

						{expandedSection === 'feedback' && (
							<div className="space-y-6">
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">Loading State</h3>
									<div className="flex items-center gap-3">
										<svg
											className="w-6 h-6 text-ieee-dark-yellow animate-spin"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
											/>
										</svg>
										<span className="font-body text-white">
											Loading your events...
										</span>
									</div>
								</div>

								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">Empty State</h3>
									<div className="text-center py-8">
										<p className="font-body text-ieee-light-grey mb-4">
											No events found
										</p>
										<Button>Create an Event</Button>
									</div>
								</div>

								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Toast Notifications
									</h3>
									<div className="space-y-3">
										<div className="flex items-start gap-3 bg-green-950 border border-green-800 rounded-lg p-4 animate-in">
											<span className="text-green-400 font-heading">✓</span>
											<p className="font-body text-green-300 text-sm">
												Successfully registered for the event!
											</p>
										</div>

										<div className="flex items-start gap-3 bg-red-950 border border-red-800 rounded-lg p-4">
											<span className="text-red-400 font-heading">✕</span>
											<p className="font-body text-red-300 text-sm">
												Failed to save changes. Please try again.
											</p>
										</div>

										<div className="flex items-start gap-3 bg-ieee-dark-yellow/10 border border-ieee-dark-yellow/40 rounded-lg p-4">
											<span className="text-ieee-dark-yellow font-heading">
												!
											</span>
											<p className="font-body text-ieee-light-grey text-sm">
												This event requires active IEEE membership.{' '}
												<span className="text-ieee-dark-yellow underline cursor-pointer">
													Learn more
												</span>
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</section>
				)}

				{/* Complex Patterns */}
				{(expandedSection === 'complex' || expandedSection === null) && (
					<section className="mb-16">
						<div
							onClick={() => toggleSection('complex')}
							className="flex items-center justify-between cursor-pointer mb-6 p-4 bg-ieee-near-black border border-ieee-dark-grey rounded-lg hover:border-ieee-grey transition-colors"
						>
							<h2 className="font-heading text-2xl text-ieee-bright-yellow">
								Complex Patterns
							</h2>
							<span className="text-ieee-light-grey">↓</span>
						</div>

						{expandedSection === 'complex' && (
							<div className="space-y-6">
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Member Profile Card
									</h3>
									<div className="max-w-sm bg-ieee-dark-grey/40 border border-ieee-dark-grey rounded-lg overflow-hidden">
										<div className="h-24 bg-gradient-to-r from-ieee-dark-yellow to-ieee-bright-yellow" />
										<div className="p-6 -mt-12 relative">
											<div className="w-24 h-24 rounded-full bg-ieee-dark-grey border-4 border-ieee-near-black mx-auto mb-4" />
											<h4 className="font-heading text-lg text-white text-center mb-1">
												Jane Doe
											</h4>
											<p className="font-body text-ieee-light-grey text-sm text-center mb-4">
												President • Computer Science
											</p>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													className="flex-1"
												>
													Message
												</Button>
												<Button size="sm" className="flex-1">
													View Profile
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Tag / Skill Badge Grid
									</h3>
									<div className="flex flex-wrap gap-2">
										{[
											'Hardware',
											'Software',
											'Web Dev',
											'Machine Learning',
											'Embedded Systems',
											'Design',
											'Testing',
											'DevOps',
										].map((tag) => (
											<span
												key={tag}
												className="px-3 py-1 bg-ieee-dark-grey text-white text-sm font-body rounded-sm
												           cursor-pointer hover:bg-ieee-grey transition-colors"
											>
												{tag}
											</span>
										))}
									</div>
								</div>

								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Filter Row with Buttons
									</h3>
									<div className="flex flex-wrap gap-2 mb-4">
										<Button variant="outline">All</Button>
										<Button variant="outline">Hardware</Button>
										<Button variant="outline">Software</Button>
										<Button variant="outline">Active</Button>
										<Button variant="outline">Completed</Button>
									</div>
									<p className="font-body text-ieee-light-grey text-sm">
										Showing 5 of 12 projects
									</p>
								</div>

								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Timeline / List Item
									</h3>
									<div className="space-y-4">
										{[
											'January 15 — General Meeting',
											'January 22 — Hackathon',
											'February 5 — Workshop',
										].map((item, i) => (
											<div key={item} className="flex gap-4">
												<div className="flex flex-col items-center">
													<div className="w-3 h-3 rounded-full bg-ieee-dark-yellow" />
													{i < 2 && (
														<div className="w-0.5 h-12 bg-ieee-dark-grey" />
													)}
												</div>
												<div>
													<p className="font-body text-white">{item}</p>
												</div>
											</div>
										))}
									</div>
								</div>

								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-4">
										Modal / Overlay Pattern
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-4">
										Dark backdrop with light content. Full-screen or centered
										dialog.
									</p>
									<div className="relative bg-black/60 rounded-lg p-8 text-center">
										<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6 max-w-sm mx-auto">
											<h4 className="font-heading text-xl text-white mb-2">
												Confirm Action
											</h4>
											<p className="font-body text-ieee-light-grey text-sm mb-6">
												Are you sure you want to delete this event? This
												cannot be undone.
											</p>
											<div className="flex gap-2 justify-center">
												<Button variant="secondary">Cancel</Button>
												<Button variant="destructive">Delete</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</section>
				)}

				{/* Custom Components */}
				{(expandedSection === 'custom' || expandedSection === null) && (
					<section className="mb-16">
						<div
							onClick={() => toggleSection('custom')}
							className="flex items-center justify-between cursor-pointer mb-6 p-4 bg-ieee-near-black border border-ieee-dark-grey rounded-lg hover:border-ieee-grey transition-colors"
						>
							<h2 className="font-heading text-2xl text-ieee-bright-yellow">
								Custom Components
							</h2>
							<span className="text-ieee-light-grey">↓</span>
						</div>

						{expandedSection === 'custom' && (
							<div className="space-y-8">
								{/* QR Event Scanner */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-2">
										QR Event Scanner
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-6">
										Admin tool for scanning QR codes to mark attendees at
										events. Used on the admin dashboard. Requires an active
										event to record attendance against.
									</p>
									<QREventScanner />
								</div>

								{/* Event List */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-2">Event List</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-6">
										Displays all upcoming and past events pulled from the
										database via tRPC. Used on the member dashboard.
									</p>
									<EventList />
								</div>

								{/* Form Popup */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-2">
										Create Event Form
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-6">
										Modal form for creating new events. Trigger the button below
										to open the full form.
									</p>
									<FormPopup />
								</div>

								{/* Timer */}
								<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
									<h3 className="font-subheading text-lg mb-2">
										Countdown Timer
									</h3>
									<p className="font-body text-ieee-light-grey text-sm mb-6">
										Animated countdown used for events and deadlines. Displays
										days, hours, minutes, and seconds.
									</p>
									<Timer />
								</div>
							</div>
						)}
					</section>
				)}

				{/* Footer */}
				<section className="py-12 border-t border-ieee-dark-grey">
					<p className="font-body text-ieee-grey text-sm text-center">
						See{' '}
						<Link
							href="/style-guide"
							className="text-ieee-light-grey hover:text-ieee-bright-yellow"
						>
							/style-guide
						</Link>{' '}
						for color and typography reference. See{' '}
						<Link
							href="/docs"
							className="text-ieee-light-grey hover:text-ieee-bright-yellow"
						>
							docs/COMPONENTS.md
						</Link>{' '}
						for code patterns.
					</p>
				</section>
			</div>
		</div>
	);
}
