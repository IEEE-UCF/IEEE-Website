import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';

const pageTitle = 'Connect | IEEE UCF';
const pageDescription = 'ieee.ucf@gmail.com | ieee@ucf.edu';

export const metadata: Metadata = {
	title: pageTitle,
	description: pageDescription,
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: 'https://www.ieeeucf.com/connect',
		type: 'website',
	},
};

export default function ConnectPage() {
	return (
		<div className="flex flex-col max-w-screen overflow-hidden">
			<div className="relative w-full h-[120vh]">
				<div className="absolute z-4 w-full h-fit inset-0 items-center px-5">
					<Navbar />
				</div>
				<div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r inset-0 items-center px-5 [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_5%,transparent_100%)] z-2"></div>

				<div className="flex flex-row my-20 p-40 justify-center lg:justify-end absolute z-3 w-screen float">
					<div className="flex flex-col items-center lg:items-end justify-end self-end text-center lg:text-right gap-y-5">
						<div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-5xl sm:text-6xl">
							CONNECT WITH US
						</div>
						<div className="font-[body-font] text-white text-xl lg:text-2xl w-3/4">
							To keep updated on upcoming events, novel projects, and other related
							endeavors, follow IEEE @ UCF on various forms of social media.
						</div>
					</div>
				</div>

				<div className="bg-black h-full w-full">
					<Image
						className="absolute h-full w-full object-cover z-0 opacity-50"
						src="/gbms/firstgbm2024.png"
						alt="About Us Photo"
						width={2000}
						height={2000}
					/>
				</div>
			</div>

			<div className="relative -translate-y-20 w-full overflow-hidden leading-none">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1200 120"
					preserveAspectRatio="none"
					className="w-full h-20"
				>
					<defs>
						<radialGradient id="bg-gradient4" cx="40%" cy="120%" r="130%">
							<stop offset="10%" stopColor="#000000" />
							<stop offset="100%" stopColor="#3d3110" />
						</radialGradient>
					</defs>
					<path
						d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86, 82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53, 26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
						fill="url(#bg-gradient4)"
						transform="scale(1,-1) translate(0,-120)"
					/>
				</svg>
			</div>

			<div className="flex display flex-col">
				{/* SOCIALS SECTION */}
				<div className="justify-between items-center py-20 px-8 lg:px-15 bg-[#30250a] flex flex-col lg:flex-row gap-y-10 -translate-y-20">
					<div className="flex flex-col display gap-y-3 w-full lg:w-auto">
						<div className="text-[var(--ieee-bright-yellow)] font-[heading-font] text-4xl">
							FOLLOW OUR SOCIALS
						</div>
						<div className="flex flex-row font-bold text-white text-xl lg:text-2xl items-center gap-x-5 font-['Open Sans'] flex-wrap">
							ieee.ucf@gmail.com | ieee@ucf.edu
						</div>

						<Link
							href={'https://discord.com/invite/WBcKem9kCq'}
							className="flex flex-row font-bold text-white text-xl lg:text-2xl items-center gap-x-5 font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)] transition-colors"
						>
							JOIN OUR DISCORD
							<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
								<path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
							</svg>
						</Link>

						<Link
							href={'https://www.instagram.com/ieeeucf/?hl=en'}
							className="flex flex-row font-bold text-white text-xl lg:text-2xl items-center gap-x-5 font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)] transition-colors"
						>
							FOLLOW US ON INSTAGRAM
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
								<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
							</svg>
						</Link>

						<Link
							href={'https://www.youtube.com/@ieeeucf2287'}
							className="flex flex-row font-bold text-white text-xl lg:text-2xl items-center gap-x-5 font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)] transition-colors"
						>
							SUBSCRIBE TO OUR YOUTUBE
							<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
								<path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
							</svg>
						</Link>

						<Link
							href={'https://www.linkedin.com/company/ieee-ucf/'}
							className="flex flex-row font-bold text-white text-xl lg:text-2xl items-center gap-x-5 font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)] transition-colors"
						>
							CONNECT WITH US ON LINKEDIN
							<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
								<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
							</svg>
						</Link>

						<Link
							href={'https://www.facebook.com/ieeeatucf/'}
							className="flex flex-row font-bold text-white text-xl lg:text-2xl items-center gap-x-5 font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)] transition-colors"
						>
							FRIEND US ON FACEBOOK
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
								<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
							</svg>
						</Link>

						<Link
							href={'https://github.com/IEEE-UCF'}
							className="flex flex-row font-bold text-white text-xl lg:text-2xl items-center gap-x-5 font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)] transition-colors"
						>
							ADD US ON GITHUB
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
								<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
							</svg>
						</Link>
					</div>

					<Image
						className="h-80 lg:h-100 w-full lg:w-150 object-cover rounded-sm hover:scale-101 transition-transform lg:block"
						src="/committees/prodev3.png"
						alt="About Us Photo"
						width={2000}
						height={2000}
					/>
				</div>

				<div className="relative -translate-y-40 w-full overflow-hidden leading-none">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none"
						className="w-full h-20"
					>
						<defs>
							<radialGradient id="bg-gradient5" cx="40%" cy="120%" r="130%">
								<stop offset="10%" stopColor="#000000" />
								<stop offset="100%" stopColor="#000000" />
							</radialGradient>
						</defs>
						<path
							d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86, 82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53, 26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
							fill="url(#bg-gradient5)"
							transform="scale(1,-1) translate(0,-120)"
						/>
					</svg>
				</div>

				<div className="bg-black p-15 -translate-y-40">
					<div className="text-[var(--ieee-bright-yellow)] font-[heading-font] text-4xl place-self-start py-8">
						INTERESTED IN JOINING?
					</div>

					<div className="flex flex-row display justify-between flex-wrap basis-1">
						<Card className="lg:w-1/4 2xl:h-fit lg:h-100 w-full h-fit hover:scale-102 transition-transform rounded-sm bg-[var(--ieee-dark-grey)] border-white border-1 opacity-90 hover:opacity-100">
							<CardContent className="flex w-full justify-start flex-col items-start text-left gap-y-1 flex-wrap">
								<div className="font-[heading-font] text-white text-2xl">STEP ONE</div>
								<div className="font-[body-font] text-white">
									Head over to <Link href={'https://www.ieee.org'}>IEEE.org</Link>{' '}
									and select{' '}
									<span className="font-[subheading-italic-font] text-white">Join IEEE</span>.
								</div>
								<Image
									className="object-center object-cover w-full h-auto rounded-sm"
									src="/newmembers/stepone.png"
									alt="IEEE Logo"
									width={2000}
									height={2000}
								/>
							</CardContent>
						</Card>

						<Card className="lg:w-1/4 2xl:h-fit lg:h-100 w-full h-fit hover:scale-102 transition-transform rounded-sm bg-[var(--ieee-dark-grey)] border-white border-1 opacity-90 hover:opacity-100">
							<CardContent className="flex w-full justify-start flex-col items-start text-left gap-y-1 flex-wrap">
								<div className="font-[heading-font] text-white text-2xl">STEP TWO</div>
								<div className="font-[body-font] text-white">
									To create an account, select{' '}
									<span className="font-[subheading-italic-font] text-white">JOIN AS A STUDENT</span>.
								</div>
								<Image
									className="object-center object-cover w-full h-auto rounded-sm"
									src="/newmembers/steptwo.png"
									alt="IEEE Logo"
									width={2000}
									height={2000}
								/>
							</CardContent>
						</Card>

						<Card className="lg:w-1/4 2xl:h-fit lg:h-100 w-full h-fit hover:scale-102 transition-transform rounded-sm bg-[var(--ieee-dark-grey)] border-white border-1 opacity-90 hover:opacity-100">
							<CardContent className="flex w-full justify-start flex-col items-start text-left gap-y-1 flex-wrap">
								<div className="font-[heading-font] text-white text-2xl">STEP THREE</div>
								<div className="font-[body-font] text-white">
									Fill out the following fields.{' '}
									<span className="font-[subheading-italic-font] text-[var(--ieee-bright-yellow)]">
										Use your UCF email, not personal email!
									</span>
								</div>
								<Image
									className="object-center object-cover w-full h-auto rounded-sm"
									src="/newmembers/stepthree.png"
									alt="IEEE Logo"
									width={2000}
									height={2000}
								/>
							</CardContent>
						</Card>

						<Card className="lg:w-1/4 2xl:h-fit lg:h-100 w-full h-fit hover:scale-102 transition-transform rounded-sm bg-[var(--ieee-dark-grey)] border-white border-1 opacity-90 hover:opacity-100">
							<CardContent className="flex w-full justify-start flex-col items-start text-left gap-y-1 flex-wrap">
								<div className="font-[heading-font] text-white text-2xl">STEP FOUR</div>
								<div className="font-[body-font] text-white">
									Accept the Terms and Conditions, fill out payment information,
									and check email to confirm.
								</div>
								<Image
									className="object-center object-cover w-full h-auto rounded-sm"
									src="/newmembers/stepthree.png"
									alt="IEEE Logo"
									width={2000}
									height={2000}
								/>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<div className="-mt-40">
				<Footer />
			</div>
		</div>
	);
}