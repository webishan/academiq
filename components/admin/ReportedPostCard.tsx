'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaEye, FaTrash, FaCheck, FaUser } from 'react-icons/fa';
import { ReportedPost, Report } from '@/types/types';

interface ReportedPostCardProps {
	post: ReportedPost;
	onActionComplete: () => void;
}

export function ReportedPostCard({ post, onActionComplete }: ReportedPostCardProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/get-posts/${post.id}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete post');

			toast({
				title: 'Success',
				description: 'Post deleted successfully',
			});
			onActionComplete();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete post',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeep = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/reports/clear`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ postId: post.id }),
			});

			if (!response.ok) throw new Error('Failed to clear reports');

			toast({
				title: 'Success',
				description: 'Reports cleared successfully',
			});
			onActionComplete();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to clear reports',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-4 rounded-lg shadow bg-gray-bg border">
			<div className="flex justify-between items-start mb-4">
				<div>
					<Link href={`/post/${post.id}`} className="text-lg font-semibold hover:text-primary">
						{post.title}
					</Link>
					<div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
						<Link href={`/profile/${post.user.id}`} className="hover:text-primary flex items-center gap-1">
							<FaUser className="h-3 w-3" />
							{post.user.name}
						</Link>
						<span>•</span>
						<span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
					</div>
				</div>
				<Badge variant="warning">{post._count.reports} reports</Badge>
			</div>

			<p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.body}</p>

			<div className="flex items-center gap-2 mb-2">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm">
							<FaEye className="h-4 w-4 mr-2" />
							View Reports
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Reports for this post</DialogTitle>
							<DialogDescription>The following users have reported this post</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 max-h-[400px] overflow-y-auto">
							{post.reports.map((report: Report) => (
								<div key={report.id} className="border-b pb-4">
									<div className="flex justify-between items-start">
										<Link href={`/profile/${report.user.id}`} className="font-semibold hover:text-primary">
											{report.user.name}
										</Link>
										<span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
									</div>
									<p className="text-sm mt-2">{report.reason}</p>
								</div>
							))}
						</div>
					</DialogContent>
				</Dialog>

				<Button variant="outline" size="sm" onClick={handleKeep} disabled={isLoading}>
					<FaCheck className="h-4 w-4 mr-2" />
					Keep Post
				</Button>
				<Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
					<FaTrash className="h-4 w-4 mr-2" />
					Delete Post
				</Button>
			</div>

			<div className="text-sm text-muted-foreground">
				<span className="font-semibold">{post._count.comments}</span> comments • <span className="font-semibold">{post._count.votes}</span> votes
			</div>
		</div>
	);
}
