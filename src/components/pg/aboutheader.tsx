"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";


export default function AboutHeader() {
	const [isFlipped, setIsFlipped] = useState<boolean>(true);

	return (
		<div className="">
			<div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r  justify-center place-self-center inset-0 items-center px-5 [background:radial-gradient(300%_125%_at_30%_0%,#0c0a09_10%,transparent_100%)] z-2"></div>

			<div className="flex flex-row my-10 p-40 justify-center absolute z-3 w-screen">
				<div className="flex flex-col items-center justify-center self-center text-center gap-y-3 float">
					<div className=" font-[heading-font] text-[var(--ieee-bright-yellow)] text-5xl sm:text-6xl">WHAT IS IEEE?</div>

					<div className="text-white font-[body-font] text-xl lg:text-3xl flex flex-wrap max-w-screen px-3">ieee • /aɪ ˈtɹɪp.əl iː/ • institute of electrical and electronics engineers</div>

					<div className="mt-[23vh]"></div>

					<div className="relative group cursor-pointer max-w-screen">
						<div className="absolute -inset-2 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

						<div className="group relative w-fit overflow-hidden rounded-2xl p-[4px] bg-transparent cursor-pointer transition-transform hover:scale-102">
							<div className="animated-border pointer-events-none absolute inset-0 z-0 rounded-2xl bg-[conic-gradient(var(--ieee-bright-yellow)_20deg,transparent_120deg)] animate-spin-slow"></div>

							<button
								className="relative z-10 w-85 sm:w-120 md:w-170 lg:w-195 h-[280px] md:h-[235px] max-w-screen rounded-2xl backdrop-blur-sm p-5 justify-center items-center  bg-[#0c0a09] text-white cursor-pointer"
								onClick={() => setIsFlipped(!isFlipped)}
							>
								{isFlipped ? (
									<div>
										<div className="font-[subheading-italic-font] text-[var(--ieee-bright-yellow)] text-xl sm:text-2xl">
                                        We are the innovators of tomorrow.
										</div>
										<div className="font-[body-font] text-md sm:text-xl">
                                        Located at the University of Central Florida, our IEEE student chapter is one of the largest in the nation and boasts over 300 active members. We foster technical experience through a collaborative environment, ultimately paving the way for successful careers in diverse engineering fields.

										</div>
									</div>
								) : (
									<div>
										<div className="font-[subheading-italic-font] text-2xl">Want to see our full story?</div>
										<div className="my-6"></div>
										<div className="place-self-center w-fit hover:scale-110 transition-transform hover:text-[var(--ieee-bright-yellow)] text-2xl font-[heading-font]">
											<div className="relative group cursor-pointer">
												<div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
												<div className="relative px-8 py-7 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
													<div className="space-y-2">
														<Link href="https://www.youtube.com/watch?v=JyjVBBVm0g4">
															<p>WATCH VIDEO</p>
														</Link>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-black h-full w-full">
				<Image
					className="absolute h-full w-full object-cover object-center z-0 opacity-100"
					src="/southeastcon/secgroup.png"
					alt="About Us Photo"
					width={2000}
					height={2000}
				/>
			</div>

		</div>

	);

}