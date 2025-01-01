'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ReportedPostCard } from './ReportedPostCard';
import { ReportedCommentCard } from './ReportedCommentCard';
import { ReportedPost, ReportedComment } from '@/types/types';

export function ReportedItems() {
	const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([]);
	const [reportedComments, setReportedComments] = useState<ReportedComment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	const fetchReportedItems = async () => {
		try {
			const response = await fetch('/api/reports');
			if (!response.ok) throw new Error('Failed to fetch reported items');
			const data = await response.json();
			setReportedPosts(data.reportedPosts);
			setReportedComments(data.reportedComments);
		} catch (error) {
			console.error('Error:', error);
			toast({
				title: 'Error',
				description: 'Failed to fetch reported items',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchReportedItems();
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[200px]">
				<div className="text-muted-foreground">Loading reported items...</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-xl font-semibold mb-4">Reported Posts</h2>
				{reportedPosts.length === 0 ? (
					<p className="text-muted-foreground">No reported posts</p>
				) : (
					<div className="space-y-4">
						{reportedPosts.map((post) => (
							<ReportedPostCard key={post.id} post={post} onActionComplete={fetchReportedItems} />
						))}
					</div>
				)}
			</div>

			<div>
				<h2 className="text-xl font-semibold mb-4">Reported Comments</h2>
				{reportedComments.length === 0 ? (
					<p className="text-muted-foreground">No reported comments</p>
				) : (
					<div className="space-y-4">
						{reportedComments.map((comment) => (
							<ReportedCommentCard key={comment.id} comment={comment} onActionComplete={fetchReportedItems} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
