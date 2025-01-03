import React from 'react';

interface LoaderProps {
	className?: string;
}

export function Loader({ className = 'h-16 w-16' }: LoaderProps) {
	return (
		<div className="flex justify-center items-center h-[70vh]">
			<div
				className={`
					animate-spin 
					rounded-full 
					border-4 
					border-primary/20 
					border-t-primary 
					border-l-primary 
					${className}
				`}
			/>
		</div>
	);
}
