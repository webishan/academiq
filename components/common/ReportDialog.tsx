'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
	const [open, setOpen] = useState(false);
	const [hasReported, setHasReported] = useState(false);
	const { toast } = useToast();

	const checkExistingReport = async () => {
		try {
			const response = await fetch('/api/reports/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ postId, commentId }),
			});

			if (!response.ok) throw new Error('Failed to check report status');
			const data = await response.json();
			setHasReported(data.hasReported);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	useEffect(() => {
		if (open) {
			checkExistingReport();
		}
	}, [open]);

	const handleSubmit = async () => {
		if (hasReported) {
			setOpen(false);
			return;
		}

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
			setOpen(false);
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Report {postId ? 'Post' : 'Comment'}</DialogTitle>
					<DialogDescription>
						{hasReported
							? `You have already reported this ${postId ? 'post' : 'comment'}`
							: `Please provide a reason for reporting this ${postId ? 'post' : 'comment'}`}
					</DialogDescription>
				</DialogHeader>
				{!hasReported && (
					<Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter your reason..." className="min-h-[100px]" />
				)}
				<DialogFooter className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => {
							setReason('');
							setOpen(false);
						}}
					>
						Close
					</Button>
					{!hasReported && (
						<Button onClick={handleSubmit} disabled={isSubmitting}>
							{isSubmitting ? 'Submitting...' : 'Submit Report'}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
