'use client';

import { useState } from 'react';
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
					<DialogDescription>Please provide a reason for reporting this {postId ? 'post' : 'comment'}</DialogDescription>
				</DialogHeader>
				<Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter your reason..." className="min-h-[100px]" />
				<DialogFooter className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => {
							setReason('');
							setOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? 'Submitting...' : 'Submit Report'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
