'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

type ThemeOverrides = Record<string, string>;

interface ColorControl {
	label: string;
	description: string;
	variable: string;
	defaultValue: string;
}

interface FontControl {
	label: string;
	description: string;
	variable: string;
	defaultValue: string;
}

interface FontOption {
	label: string;
	value: string;
}

const STORAGE_KEY = 'ieee-theme-playground-overrides';

const brandColorControls: ColorControl[] = [
	{
		label: 'IEEE Black',
		description: 'Main page background and true black surfaces.',
		variable: '--color-ieee-black',
		defaultValue: '#000000',
	},
	{
		label: 'Near Black',
		description: 'Default card and panel surface.',
		variable: '--color-ieee-near-black',
		defaultValue: '#0c0a09',
	},
	{
		label: 'Warm Dark',
		description: 'Warm gradient stop and divider tone.',
		variable: '--color-ieee-warm-dark',
		defaultValue: '#3d3110',
	},
	{
		label: 'Dark Grey',
		description: 'Secondary surface and border color.',
		variable: '--color-ieee-dark-grey',
		defaultValue: '#2d2d2d',
	},
	{
		label: 'Grey',
		description: 'Muted text and inactive state color.',
		variable: '--color-ieee-grey',
		defaultValue: '#75787b',
	},
	{
		label: 'Light Grey',
		description: 'Supporting text color.',
		variable: '--color-ieee-light-grey',
		defaultValue: '#acb1b6',
	},
	{
		label: 'White',
		description: 'Primary foreground text.',
		variable: '--color-ieee-white',
		defaultValue: '#ffffff',
	},
	{
		label: 'Dark Yellow',
		description: 'Primary IEEE accent.',
		variable: '--color-ieee-dark-yellow',
		defaultValue: '#ffc72c',
	},
	{
		label: 'Bright Yellow',
		description: 'Hover accent and ring color.',
		variable: '--color-ieee-bright-yellow',
		defaultValue: '#ffd100',
	},
];

const semanticColorControls: ColorControl[] = [
	{
		label: 'Background',
		description: 'Global page background role.',
		variable: '--background',
		defaultValue: '#000000',
	},
	{
		label: 'Foreground',
		description: 'Default text role.',
		variable: '--foreground',
		defaultValue: '#ffffff',
	},
	{
		label: 'Card',
		description: 'Reusable card background role.',
		variable: '--card',
		defaultValue: '#0c0a09',
	},
	{
		label: 'Card Foreground',
		description: 'Reusable card text role.',
		variable: '--card-foreground',
		defaultValue: '#ffffff',
	},
	{
		label: 'Primary',
		description: 'Shared primary action color.',
		variable: '--primary',
		defaultValue: '#ffc72c',
	},
	{
		label: 'Primary Hover',
		description: 'Shared primary hover color.',
		variable: '--primary-hover',
		defaultValue: '#ffd100',
	},
	{
		label: 'Primary Foreground',
		description: 'Text shown on primary buttons.',
		variable: '--primary-foreground',
		defaultValue: '#000000',
	},
	{
		label: 'Secondary',
		description: 'Secondary surface role.',
		variable: '--secondary',
		defaultValue: '#2d2d2d',
	},
	{
		label: 'Muted',
		description: 'Muted surface role.',
		variable: '--muted',
		defaultValue: '#2d2d2d',
	},
	{
		label: 'Muted Foreground',
		description: 'Muted helper and metadata text.',
		variable: '--muted-foreground',
		defaultValue: '#acb1b6',
	},
	{
		label: 'Accent',
		description: 'Hover or selected surface role.',
		variable: '--accent',
		defaultValue: '#2d2d2d',
	},
	{
		label: 'Border',
		description: 'Shared border role.',
		variable: '--border',
		defaultValue: '#2d2d2d',
	},
	{
		label: 'Input',
		description: 'Shared input background and border role.',
		variable: '--input',
		defaultValue: '#2d2d2d',
	},
	{
		label: 'Ring',
		description: 'Shared focus ring role.',
		variable: '--ring',
		defaultValue: '#ffd100',
	},
];

const fontOptions: FontOption[] = [
	{ label: 'Display Font', value: 'display-font, sans-serif' },
	{ label: 'Display Italic Font', value: 'display-italic-font, sans-serif' },
	{ label: 'Heading Font', value: 'heading-font, sans-serif' },
	{ label: 'Heading Italic Font', value: 'heading-italic-font, sans-serif' },
	{ label: 'Subheading Font', value: 'subheading-font, sans-serif' },
	{ label: 'Subheading Italic Font', value: 'subheading-italic-font, sans-serif' },
	{ label: 'Body Font', value: 'body-font, sans-serif' },
	{ label: 'Body Italic Font', value: 'body-italic-font, sans-serif' },
	{ label: 'System Sans', value: 'Arial, Helvetica, sans-serif' },
	{ label: 'System Serif', value: 'Georgia, Times New Roman, serif' },
	{ label: 'Monospace', value: 'Courier New, monospace' },
	{ label: 'Rounded Sans', value: 'Trebuchet MS, Arial, sans-serif' },
];

const fontControls: FontControl[] = [
	{
		label: 'Display Role',
		description: 'Used by hero-sized display text.',
		variable: '--font-display',
		defaultValue: 'display-font, sans-serif',
	},
	{
		label: 'Heading Role',
		description: 'Used by page and section headings.',
		variable: '--font-heading',
		defaultValue: 'heading-font, sans-serif',
	},
	{
		label: 'Subheading Role',
		description: 'Used by card titles and labels.',
		variable: '--font-subheading',
		defaultValue: 'subheading-font, sans-serif',
	},
	{
		label: 'Body Role',
		description: 'Used by paragraphs and supporting text.',
		variable: '--font-body',
		defaultValue: 'body-font, sans-serif',
	},
];

const isHexColor = (value: string) => /^#([0-9a-f]{6})$/i.test(value);

function ThemePlayground({ pageName }: { pageName: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [overrides, setOverrides] = useState<ThemeOverrides>({});
	const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
	const previousKeysRef = useRef<string[]>([]);

	useEffect(() => {
		const savedOverrides = window.localStorage.getItem(STORAGE_KEY);
		if (!savedOverrides) {
			return;
		}

		try {
			setOverrides(JSON.parse(savedOverrides) as ThemeOverrides);
		} catch {
			window.localStorage.removeItem(STORAGE_KEY);
		}
	}, []);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
	}, [overrides]);

	useEffect(() => {
		const root = document.documentElement;
		const previousKeys = previousKeysRef.current;

		for (const key of previousKeys) {
			if (!(key in overrides)) {
				root.style.removeProperty(key);
			}
		}

		for (const [key, value] of Object.entries(overrides)) {
			root.style.setProperty(key, value);
		}

		previousKeysRef.current = Object.keys(overrides);

		return () => {
			for (const key of previousKeysRef.current) {
				root.style.removeProperty(key);
			}
		};
	}, [overrides]);

	const activeOverrideCount = Object.keys(overrides).length;

	const copyPayload = useMemo(() => {
		const lines = Object.entries(overrides)
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([key, value]) => `  ${key}: ${value};`);

		return [':root {', ...lines, '}'].join('\n');
	}, [overrides]);

	const updateColorOverride = (variable: string, value: string) => {
		setOverrides((currentOverrides) => ({
			...currentOverrides,
			[variable]: value.toUpperCase(),
		}));
	};

	const updateFontOverride = (variable: string, value: string) => {
		setOverrides((currentOverrides) => ({
			...currentOverrides,
			[variable]: value,
		}));
	};

	const resetOverride = (variable: string) => {
		setOverrides((currentOverrides) => {
			const nextOverrides = { ...currentOverrides };
			delete nextOverrides[variable];
			return nextOverrides;
		});
	};

	const resetAllOverrides = () => {
		setOverrides({});
		setCopyState('idle');
		window.localStorage.removeItem(STORAGE_KEY);
	};

	const copyOverrides = async () => {
		if (!activeOverrideCount) {
			return;
		}

		try {
			await navigator.clipboard.writeText(copyPayload);
			setCopyState('copied');
		} catch {
			setCopyState('error');
		}

		window.setTimeout(() => setCopyState('idle'), 2000);
	};

	return (
		<div className="fixed right-4 bottom-4 z-[100]">
			{isOpen ? (
				<div className="bg-ieee-near-black border border-ieee-dark-grey shadow-2xl w-[24rem] max-w-[calc(100vw-2rem)] rounded-xl overflow-hidden">
					<div className="flex items-start justify-between gap-4 border-b border-ieee-dark-grey px-4 py-4">
						<div>
							<p className="font-heading text-ieee-bright-yellow text-lg">
								Theme Lab
							</p>
							<p className="font-body text-ieee-light-grey text-xs">
								Live token testing for {pageName}
							</p>
						</div>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="text-ieee-light-grey hover:text-ieee-bright-yellow transition-colors"
							aria-label="Close theme lab"
						>
							×
						</button>
					</div>

					<div className="max-h-[75vh] overflow-y-auto px-4 py-4 space-y-6">
						<div className="bg-ieee-black/60 border border-ieee-dark-grey rounded-lg p-3">
							<p className="font-subheading text-white text-sm mb-1">
								How this works
							</p>
							<p className="font-body text-ieee-light-grey text-xs leading-5">
								Brand token changes affect IEEE classes like{' '}
								<span className="text-white">bg-ieee-black</span>. Semantic token
								changes affect shared UI classes like{' '}
								<span className="text-white">bg-card</span> and{' '}
								<span className="text-white">text-foreground</span>.
							</p>
						</div>

						<div className="flex flex-wrap gap-2">
							<Button size="sm" onClick={resetAllOverrides}>
								Reset All
							</Button>
							<Button
								size="sm"
								variant="secondary"
								onClick={copyOverrides}
								disabled={!activeOverrideCount}
							>
								Copy CSS
							</Button>
						</div>

						{copyState === 'copied' && (
							<p className="font-body text-green-400 text-xs">
								Copied current overrides to your clipboard.
							</p>
						)}

						{copyState === 'error' && (
							<p className="font-body text-red-400 text-xs">
								Couldn&apos;t copy automatically, but the preview still works.
							</p>
						)}

						<div className="space-y-3">
							<p className="font-heading text-white text-sm">Brand Tokens</p>
							{brandColorControls.map((control) => {
								const currentValue = overrides[control.variable] ?? control.defaultValue;
								const colorValue = isHexColor(currentValue)
									? currentValue
									: control.defaultValue;

								return (
									<div
										key={control.variable}
										className="bg-ieee-black/50 border border-ieee-dark-grey rounded-lg p-3 space-y-2"
									>
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="font-subheading text-white text-sm">
													{control.label}
												</p>
												<p className="font-body text-ieee-light-grey text-xs leading-5">
													{control.description}
												</p>
											</div>
											<button
												type="button"
												onClick={() => resetOverride(control.variable)}
												className="font-body text-ieee-grey hover:text-ieee-bright-yellow text-xs transition-colors"
											>
												Reset
											</button>
										</div>
										<div className="flex items-center gap-3">
											<input
												type="color"
												value={colorValue}
												onChange={(event) =>
													updateColorOverride(control.variable, event.target.value)
												}
												className="h-10 w-14 cursor-pointer rounded border border-ieee-dark-grey bg-transparent"
											/>
											<div className="font-body text-xs text-ieee-light-grey">
												<div>{control.variable}</div>
												<div className="text-white">{colorValue}</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						<div className="space-y-3">
							<p className="font-heading text-white text-sm">Semantic Tokens</p>
							{semanticColorControls.map((control) => {
								const currentValue = overrides[control.variable] ?? control.defaultValue;
								const colorValue = isHexColor(currentValue)
									? currentValue
									: control.defaultValue;

								return (
									<div
										key={control.variable}
										className="bg-ieee-black/50 border border-ieee-dark-grey rounded-lg p-3 space-y-2"
									>
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="font-subheading text-white text-sm">
													{control.label}
												</p>
												<p className="font-body text-ieee-light-grey text-xs leading-5">
													{control.description}
												</p>
											</div>
											<button
												type="button"
												onClick={() => resetOverride(control.variable)}
												className="font-body text-ieee-grey hover:text-ieee-bright-yellow text-xs transition-colors"
											>
												Reset
											</button>
										</div>
										<div className="flex items-center gap-3">
											<input
												type="color"
												value={colorValue}
												onChange={(event) =>
													updateColorOverride(control.variable, event.target.value)
												}
												className="h-10 w-14 cursor-pointer rounded border border-ieee-dark-grey bg-transparent"
											/>
											<div className="font-body text-xs text-ieee-light-grey">
												<div>{control.variable}</div>
												<div className="text-white">{colorValue}</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						<div className="space-y-3">
							<p className="font-heading text-white text-sm">Font Roles</p>
							{fontControls.map((control) => {
								const currentValue = overrides[control.variable] ?? control.defaultValue;

								return (
									<div
										key={control.variable}
										className="bg-ieee-black/50 border border-ieee-dark-grey rounded-lg p-3 space-y-2"
									>
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="font-subheading text-white text-sm">
													{control.label}
												</p>
												<p className="font-body text-ieee-light-grey text-xs leading-5">
													{control.description}
												</p>
											</div>
											<button
												type="button"
												onClick={() => resetOverride(control.variable)}
												className="font-body text-ieee-grey hover:text-ieee-bright-yellow text-xs transition-colors"
											>
												Reset
											</button>
										</div>
										<select
											value={currentValue}
											onChange={(event) =>
												updateFontOverride(control.variable, event.target.value)
											}
											className="w-full rounded-md border border-ieee-dark-grey bg-ieee-dark-grey px-3 py-2 text-sm font-body text-white outline-none transition-colors focus:border-ieee-bright-yellow"
										>
											{fontOptions.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
										<p className="font-body text-xs text-ieee-grey">
											{control.variable}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-end gap-2">
					{activeOverrideCount > 0 && (
						<p className="bg-ieee-near-black border border-ieee-dark-grey rounded-full px-3 py-1 font-body text-xs text-ieee-light-grey">
							{activeOverrideCount} live override
							{activeOverrideCount === 1 ? '' : 's'}
						</p>
					)}
					<Button onClick={() => setIsOpen(true)}>Open Theme Lab</Button>
				</div>
			)}
		</div>
	);
}

export { ThemePlayground };
