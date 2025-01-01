'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReportDialogProps {
	postId?: string;
	commentId?: string;
	trigger: React.ReactNode;
}

export function ReportDialog({ postId, commentId, trigger }: ReportDialogProps) {
	const [reason, setReason] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async () => {
		if (!reason.trim()) {
			toast({
				title: 'Error',
				description: 'Please provide a reason for reporting',
				variant: 'destructive',
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch('/api/reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					postId,
					commentId,
					reason: reason.trim(),
				}),
			});

			if (!response.ok) throw new Error('Failed to submit report');

			toast({
				title: 'Success',
				description: 'Report submitted successfully',
			});
			setReason('');
		} catch (error) {
			console.error('Error:', error);
			toast({
				title: 'Error',
				description: 'Failed to submit report',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Report {postId ? 'Post' : 'Comment'}</AlertDialogTitle>
					<AlertDialogDescription>Please provide a reason for reporting this {postId ? 'post' : 'comment'}</AlertDialogDescription>
				</AlertDialogHeader>
				<Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter your reason..." className="min-h-[100px]" />
				<AlertDialogFooter>
					<Button variant="outline" onClick={() => setReason('')}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? 'Submitting...' : 'Submit Report'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
