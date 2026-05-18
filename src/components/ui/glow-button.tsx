'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps {
	children: React.ReactNode;
	className?: string;
	innerClassName?: string;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Two-layer glow CTA button.
 *
 * Usage:
 *   <GlowButton>
 *     <span className="text-white font-heading">Join Us</span>
 *   </GlowButton>
 *
 * Wrap in <Link> or <a> when the button should navigate:
 *   <Link href="/about">
 *     <GlowButton>Learn More</GlowButton>
 *   </Link>
 *
 * Use innerClassName to override padding/layout of the inner surface.
 */
export function GlowButton({ children, className, innerClassName, onClick }: GlowButtonProps) {
	return (
		<div className={cn('relative group cursor-pointer w-fit', className)} onClick={onClick}>
			{/* Glow halo — brightens on hover */}
			<div className="absolute -inset-1 bg-gradient-to-r from-ieee-bright-yellow to-ieee-bright-yellow rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-700 group-hover:duration-200 pointer-events-none" />
			{/* Content surface */}
			<div className={cn(
				'relative px-8 py-4 bg-ieee-near-black ring-1 ring-white/5 rounded-lg leading-none flex items-center justify-center gap-2',
				innerClassName,
			)}>
				{children}
			</div>
		</div>
	);
}
