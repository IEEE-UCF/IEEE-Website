'use client';

import { Button } from '@/components/ui/button';
import { GlowButton } from '@/components/ui/glow-button';
import { ThemePlayground } from '@/components/theme-playground';

export default function StyleGuide() {
	return (
		<div className="bg-ieee-black text-white min-h-screen">
			<ThemePlayground pageName="Style Guide" />
			{/* Header */}
			<div className="bg-ieee-near-black border-b border-ieee-dark-grey px-6 py-12">
				<div className="max-w-6xl mx-auto">
					<h1 className="font-display text-6xl text-ieee-bright-yellow mb-2">
						IEEE UCF Design System
					</h1>
					<p className="font-body text-xl text-ieee-light-grey">
						A complete reference for colors, typography, components, and patterns.
					</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-6 py-12">
				{/* Color Palette */}
				<section className="mb-16">
					<h2 className="font-heading text-3xl text-ieee-bright-yellow mb-6">
						Color Palette
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* Brand Colors */}
						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded bg-ieee-black border border-ieee-grey" />
								<div>
									<p className="font-heading text-sm">IEEE Black</p>
									<p className="font-body text-xs text-ieee-grey">#000000</p>
								</div>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded bg-ieee-near-black border border-ieee-dark-grey" />
								<div>
									<p className="font-heading text-sm">Near Black</p>
									<p className="font-body text-xs text-ieee-grey">#0c0a09</p>
								</div>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded bg-ieee-warm-dark" />
								<div>
									<p className="font-heading text-sm">Warm Dark</p>
									<p className="font-body text-xs text-ieee-grey">#3d3110</p>
								</div>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded bg-ieee-dark-grey" />
								<div>
									<p className="font-heading text-sm">Dark Grey</p>
									<p className="font-body text-xs text-ieee-grey">#2d2d2d</p>
								</div>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded bg-ieee-grey" />
								<div>
									<p className="font-heading text-sm">Grey</p>
									<p className="font-body text-xs text-ieee-grey">#75787b</p>
								</div>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded bg-ieee-light-grey" />
								<div>
									<p className="font-heading text-sm">Light Grey</p>
									<p className="font-body text-xs text-ieee-grey">#acb1b6</p>
								</div>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded bg-ieee-white border border-ieee-grey" />
								<div>
									<p className="font-heading text-sm">White</p>
									<p className="font-body text-xs text-ieee-grey">#ffffff</p>
								</div>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded bg-ieee-dark-yellow" />
								<div>
									<p className="font-heading text-sm">Dark Yellow</p>
									<p className="font-body text-xs text-ieee-grey">#ffc72c</p>
								</div>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded bg-ieee-bright-yellow" />
								<div>
									<p className="font-heading text-sm">Bright Yellow</p>
									<p className="font-body text-xs text-ieee-grey">#ffd100</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Typography */}
				<section className="mb-16">
					<h2 className="font-heading text-3xl text-ieee-bright-yellow mb-6">
						Typography
					</h2>

					<div className="space-y-4">
						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-display text-4xl text-white mb-2">
								Display Font (ExtraBold)
							</p>
							<p className="font-body text-sm text-ieee-grey">
								Open Sans Extra Bold — use for hero titles only
							</p>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-heading text-3xl text-white mb-2">
								Heading Font (Bold)
							</p>
							<p className="font-body text-sm text-ieee-grey">
								Open Sans Bold — page headers, button labels, section titles
							</p>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-subheading text-2xl text-white mb-2">
								Subheading Font (Medium)
							</p>
							<p className="font-body text-sm text-ieee-grey">
								Open Sans Medium — card titles, form labels, accordion triggers
							</p>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-body text-xl text-white mb-2">Body Font (Light)</p>
							<p className="font-body text-sm text-ieee-grey">
								Open Sans Light — body copy, descriptions, nav links
							</p>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-display-italic text-2xl text-white mb-2">
								Display Italic Font
							</p>
							<p className="font-body-italic text-sm text-ieee-grey">
								Open Sans Extra Bold Italic — decorative text
							</p>
						</div>
					</div>
				</section>

				{/* Button Variants */}
				<section className="mb-16">
					<h2 className="font-heading text-3xl text-ieee-bright-yellow mb-6">
						Button Variants
					</h2>

					<div className="space-y-6">
						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-heading text-lg mb-4">Default (Primary Action)</p>
							<div className="flex flex-wrap gap-3">
								<Button>Join IEEE UCF</Button>
								<Button size="sm">Small</Button>
								<Button size="lg">Large</Button>
								<Button disabled>Disabled</Button>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-heading text-lg mb-4">
								Secondary (Supporting Action)
							</p>
							<div className="flex flex-wrap gap-3">
								<Button variant="secondary">Cancel</Button>
								<Button variant="secondary" size="sm">
									Small
								</Button>
								<Button variant="secondary" size="lg">
									Large
								</Button>
								<Button variant="secondary" disabled>
									Disabled
								</Button>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-heading text-lg mb-4">Outline (Low-emphasis)</p>
							<div className="flex flex-wrap gap-3">
								<Button variant="outline">Filter Pill</Button>
								<Button variant="outline" size="sm">
									Small
								</Button>
								<Button variant="outline" size="lg">
									Large
								</Button>
								<Button variant="outline" disabled>
									Disabled
								</Button>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-heading text-lg mb-4">Ghost (Icon/subtle)</p>
							<div className="flex flex-wrap gap-3">
								<Button variant="ghost">View Details</Button>
								<Button variant="ghost" size="sm">
									Small
								</Button>
								<Button variant="ghost" size="icon">
									×
								</Button>
								<Button variant="ghost" disabled>
									Disabled
								</Button>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-heading text-lg mb-4">
								Destructive (Sign Out, Delete)
							</p>
							<div className="flex flex-wrap gap-3">
								<Button variant="destructive">Sign Out</Button>
								<Button variant="destructive" size="sm">
									Small
								</Button>
								<Button variant="destructive" size="lg">
									Large
								</Button>
								<Button variant="destructive" disabled>
									Disabled
								</Button>
							</div>
						</div>

						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<p className="font-heading text-lg mb-4">Link (Hyperlink style)</p>
							<div className="flex flex-wrap gap-3">
								<Button variant="link">Learn More</Button>
								<Button variant="link" size="sm">
									Small
								</Button>
								<Button variant="link" disabled>
									Disabled
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Glow Button */}
				<section className="mb-16">
					<h2 className="font-heading text-3xl text-ieee-bright-yellow mb-6">
						GlowButton — Marquee CTA
					</h2>

					<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
						<p className="font-body text-ieee-light-grey mb-8">
							Two-layer animated glow for hero and high-visibility CTAs:
						</p>
						<div className="flex flex-wrap gap-6 items-center justify-center">
							<GlowButton>
								<span className="text-white font-heading">Get Involved</span>
							</GlowButton>
							<GlowButton>
								<span className="text-white font-heading">Join IEEE UCF</span>
							</GlowButton>
						</div>
					</div>
				</section>

				{/* Form Elements */}
				<section className="mb-16">
					<h2 className="font-heading text-3xl text-ieee-bright-yellow mb-6">
						Form Elements
					</h2>

					<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
						<div className="max-w-sm space-y-4">
							<div>
								<label className="block text-sm font-subheading text-ieee-light-grey mb-1">
									Text Input
								</label>
								<input
									type="text"
									placeholder="Enter your name"
									className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
									           placeholder:text-ieee-grey
									           focus:outline-none focus:border-ieee-bright-yellow focus:ring-1 focus:ring-ieee-bright-yellow
									           transition-colors"
								/>
							</div>

							<div>
								<label className="block text-sm font-subheading text-ieee-light-grey mb-1">
									Select
								</label>
								<select
									className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
								                  focus:outline-none focus:border-ieee-bright-yellow
								                  transition-colors"
								>
									<option>Choose an option</option>
									<option>Hardware</option>
									<option>Software</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-subheading text-ieee-light-grey mb-1">
									Textarea
								</label>
								<textarea
									rows={3}
									placeholder="Tell us about yourself"
									className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
									           placeholder:text-ieee-grey
									           focus:outline-none focus:border-ieee-bright-yellow focus:ring-1 focus:ring-ieee-bright-yellow
									           transition-colors resize-none"
								/>
							</div>

							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="checkbox"
									className="h-4 w-4 accent-ieee-dark-yellow border-ieee-grey rounded"
								/>
								<label
									htmlFor="checkbox"
									className="text-sm font-subheading text-ieee-light-grey"
								>
									I agree to the terms
								</label>
							</div>
						</div>
					</div>
				</section>

				{/* Card Examples */}
				<section className="mb-16">
					<h2 className="font-heading text-3xl text-ieee-bright-yellow mb-6">
						Card Patterns
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Standard Card */}
						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<h3 className="font-subheading text-xl text-white mb-2">
								Standard Card
							</h3>
							<p className="font-body text-ieee-light-grey text-sm">
								Basic dark card with borders. Used throughout the site for content.
							</p>
						</div>

						{/* Hoverable Card */}
						<div
							className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6
						                cursor-pointer transition-transform hover:scale-102 hover:border-ieee-grey"
						>
							<h3 className="font-subheading text-xl text-white mb-2">
								Hoverable Card
							</h3>
							<p className="font-body text-ieee-light-grey text-sm">
								Scale on hover. Try hovering over this card.
							</p>
						</div>

						{/* Active/Selected Card */}
						<div className="bg-ieee-near-black border-2 border-ieee-bright-yellow rounded-lg p-6">
							<h3 className="font-subheading text-xl text-white mb-2">
								Selected State
							</h3>
							<p className="font-body text-ieee-light-grey text-sm">
								Yellow border indicates selection or active state.
							</p>
						</div>

						{/* Event Card Skeleton */}
						<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
							<div className="space-y-3">
								<h3 className="font-subheading text-lg text-white">Event Title</h3>
								<p className="font-body text-ieee-light-grey text-sm">
									Engineering Building, Room 101
								</p>
								<p className="font-body text-ieee-grey text-xs">
									Jan 15, 2025 • 6:00 PM
								</p>
								<Button size="sm">Learn More</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Status & Feedback */}
				<section className="mb-16">
					<h2 className="font-heading text-3xl text-ieee-bright-yellow mb-6">
						Status & Feedback
					</h2>

					<div className="space-y-4">
						{/* Success */}
						<div className="flex items-start gap-3 bg-green-950 border border-green-800 rounded-lg p-4">
							<div className="text-green-400 text-lg mt-0.5">✓</div>
							<div>
								<p className="font-heading text-sm text-green-400">Success</p>
								<p className="font-body text-sm text-green-300">
									Your changes have been saved successfully.
								</p>
							</div>
						</div>

						{/* Error */}
						<div className="flex items-start gap-3 bg-red-950 border border-red-800 rounded-lg p-4">
							<div className="text-red-400 text-lg mt-0.5">✕</div>
							<div>
								<p className="font-heading text-sm text-red-400">Error</p>
								<p className="font-body text-sm text-red-300">
									Something went wrong. Please try again.
								</p>
							</div>
						</div>

						{/* Warning */}
						<div className="flex items-start gap-3 bg-ieee-dark-yellow/10 border border-ieee-dark-yellow/40 rounded-lg p-4">
							<div className="text-ieee-dark-yellow text-lg mt-0.5">!</div>
							<div>
								<p className="font-heading text-sm text-ieee-dark-yellow">
									Warning
								</p>
								<p className="font-body text-sm text-ieee-light-grey">
									Note: Dues are required for this event.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Text Hierarchy */}
				<section className="mb-16">
					<h2 className="font-heading text-3xl text-ieee-bright-yellow mb-6">
						Text Hierarchy
					</h2>

					<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6 space-y-6">
						<div>
							<p className="text-xs font-subheading text-ieee-grey mb-1">
								PRIMARY CONTENT
							</p>
							<p className="text-white font-body text-lg">
								Main body text and primary content sits on white for maximum
								contrast and readability.
							</p>
						</div>

						<div>
							<p className="text-xs font-subheading text-ieee-grey mb-1">
								SECONDARY TEXT
							</p>
							<p className="text-ieee-light-grey font-body text-base">
								Supporting information, descriptions, and secondary content use
								light grey for visual hierarchy.
							</p>
						</div>

						<div>
							<p className="text-xs font-subheading text-ieee-grey mb-1">
								MUTED / METADATA
							</p>
							<p className="text-ieee-grey font-body text-sm">
								Timestamps, tags, and small metadata are muted with darker grey.
							</p>
						</div>

						<div>
							<p className="text-xs font-subheading text-ieee-grey mb-1">
								BRAND ACCENT
							</p>
							<p className="text-ieee-dark-yellow font-heading text-base">
								Key highlights and brand emphasis use the IEEE yellow.
							</p>
						</div>
					</div>
				</section>

				{/* Footer */}
				<section className="py-12 border-t border-ieee-dark-grey">
					<p className="font-body text-ieee-grey text-sm text-center">
						For complete documentation, see{' '}
						<span className="text-ieee-light-grey">docs/STYLING.md</span> and{' '}
						<span className="text-ieee-light-grey">docs/COMPONENTS.md</span>
					</p>
				</section>
			</div>
		</div>
	);
}
