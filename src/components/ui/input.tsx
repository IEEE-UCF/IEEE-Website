import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'file:text-muted-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
				'bg-input border-input text-foreground h-10 w-full min-w-0 rounded-md border px-3 py-2 text-sm font-body shadow-xs',
				'transition-[border-color,box-shadow,background-color,color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-subheading',
				'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
				'aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20',
				'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-input disabled:bg-input/60 disabled:text-muted-foreground disabled:opacity-60 md:text-sm',
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
