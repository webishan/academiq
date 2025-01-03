import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const loading = () => {
	return (
		<main className="container mx-auto py-8 px-4">
			<div className="w-full flex justify-between items-center max-w-4xl mx-auto">
				<Skeleton className="h-10 w-48" />
			</div>
			<div className="grid gap-4 grid-cols-1 gap-y-8 max-w-4xl mx-auto mt-8">
				{[1, 2, 3].map((i) => (
					<div key={i} className="w-full rounded-lg border shadow-sm p-4">
						<div className="flex items-center justify-between mb-4">
							<Skeleton className="h-6 w-24" />
							<Skeleton className="h-4 w-32" />
						</div>
						<Skeleton className="h-8 w-3/4 mb-4" />
						<div className="space-y-1 bg-gray-bg py-6 px-4 rounded-xl mb-4">
							<div className="flex flex-wrap items-center gap-4">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-5 w-28" />
							</div>
						</div>
						<Skeleton className="h-20 w-full mb-4" />
						<div className="flex gap-2 mb-4">
							<Skeleton className="h-5 w-16 rounded-full" />
							<Skeleton className="h-5 w-16 rounded-full" />
						</div>
						<div className="flex justify-between items-center">
							<div className="flex gap-2">
								<Skeleton className="h-8 w-20" />
								<Skeleton className="h-8 w-20" />
								<Skeleton className="h-8 w-20" />
							</div>
							<Skeleton className="h-8 w-20" />
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default loading;
