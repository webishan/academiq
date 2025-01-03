import { Skeleton } from '@/components/ui/skeleton';

export function PostCardSkeleton() {
	return (
		<div className="w-full rounded-lg border shadow-sm p-4">
			<div className="space-y-3">
				{/* Header */}
				<div className="space-y-3">
					<Skeleton className="h-6 w-24" />
					<div className="flex justify-between items-start">
						<div className="space-y-2 flex-1">
							<Skeleton className="h-7 w-3/4" />
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-4 rounded-full" />
								<Skeleton className="h-4 w-32" />
							</div>
						</div>
						<Skeleton className="h-8 w-8 rounded-full" />
					</div>
				</div>

				{/* Body */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
				</div>

				{/* Topics */}
				<div className="flex gap-2 mt-4">
					<Skeleton className="h-5 w-16 rounded-full" />
					<Skeleton className="h-5 w-20 rounded-full" />
					<Skeleton className="h-5 w-16 rounded-full" />
				</div>

				{/* Actions */}
				<div className="flex justify-between items-center mt-4">
					<div className="flex gap-2">
						<Skeleton className="h-8 w-16" />
						<Skeleton className="h-8 w-16" />
					</div>
					<div className="flex gap-2">
						<Skeleton className="h-8 w-16" />
						<Skeleton className="h-8 w-8" />
					</div>
				</div>
			</div>
		</div>
	);
}
