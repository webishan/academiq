'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaEye, FaTrash, FaCheck, FaUser } from 'react-icons/fa';
import { ReportedComment, Report } from '@/types/types';

interface ReportedCommentCardProps {
	comment: ReportedComment;
	onActionComplete: () => void;
}

export function ReportedCommentCard({ comment, onActionComplete }: ReportedCommentCardProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/comments/${comment.id}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete comment');

			toast({
				title: 'Success',
				description: 'Comment deleted successfully',
			});
			onActionComplete();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete comment',
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
				body: JSON.stringify({ commentId: comment.id }),
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
		<div className="bg-card p-4 rounded-lg shadow">
			<div className="flex justify-between items-start mb-4">
				<div>
					<Link href={`/profile/${comment.user.id}`} className="font-semibold hover:text-primary flex items-center gap-1">
						<FaUser className="h-3 w-3" />
						{comment.user.name}
					</Link>
					<Link href={`/post/${comment.post.id}`} className="text-sm text-muted-foreground hover:text-primary block mt-1">
						on post: {comment.post.title}
					</Link>
				</div>
				<Badge variant="warning">{comment._count.reports} reports</Badge>
			</div>

			<p className="text-sm mb-4 whitespace-pre-wrap">{comment.body}</p>

			<div className="flex items-center gap-2 mb-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm">
							<FaEye className="h-4 w-4 mr-2" />
							View Reports
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Reports for this comment</DialogTitle>
							<DialogDescription>The following users have reported this comment</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 max-h-[400px] overflow-y-auto">
							{comment.reports.map((report: Report) => (
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

				<Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
					<FaTrash className="h-4 w-4 mr-2" />
					Delete Comment
				</Button>
				<Button variant="outline" size="sm" onClick={handleKeep} disabled={isLoading}>
					<FaCheck className="h-4 w-4 mr-2" />
					Keep Comment
				</Button>
			</div>

			<div className="text-sm text-muted-foreground">
				Posted {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })} • <span className="font-semibold">{comment._count.votes}</span>{' '}
				votes
			</div>
		</div>
	);
}
