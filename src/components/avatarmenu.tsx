'use client';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
// import { useIsMobile } from "@/hooks/use-mobile"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	//   NavigationMenuList,
	NavigationMenuTrigger,
	//   navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

interface AvatarMenuProps {
	image: string; // Define the type for the image prop
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({ image }) => {
	return (
		<div className="z-100">
			<NavigationMenu>
				<NavigationMenuItem>
					<NavigationMenuTrigger>
						<Image
							className="object-cover rounded-full h-12 w-12 border border-white hover:scale-107 transition-all cursor-pointer"
							src={image}
							alt="Profile"
							width={2000}
							height={2000}
						/>
					</NavigationMenuTrigger>

					<NavigationMenuContent>
						<div className="grid w-fit gap-4 bg-ieee-dark-yellow rounded-md ">
							<div className="flex flex-col">
								<NavigationMenuLink asChild>
									<Link
										href="/dashboard"
										className="m-1 px-3 py-1.5 rounded-sm hover:bg-ieee-bright-yellow transition-all flex-row items-center gap-2 text-black font-subheading"
									>
										DASHBOARD
									</Link>
								</NavigationMenuLink>

								<NavigationMenuLink asChild>
									<Link
										href="/settings"
										className="m-1 px-3 py-1.5 rounded-sm hover:bg-ieee-bright-yellow transition-all flex-row items-center gap-2 text-black font-subheading"
									>
										SETTINGS
									</Link>
								</NavigationMenuLink>
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenu>
		</div>
	);
};

export { AvatarMenu };
