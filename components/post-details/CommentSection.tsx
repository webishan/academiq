'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Comment } from './Comment';
import { useToast } from '@/hooks/use-toast';

const commentSchema = z.object({
	body: z.string().min(1, 'Comment cannot be empty'),
});

interface CommentSectionProps {
	postId: string;
	currentUserId?: string;
}

export default function CommentSection({ postId, currentUserId }: CommentSectionProps) {
	const [comments, setComments] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof commentSchema>>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			body: '',
		},
	});

	const fetchComments = async () => {
		try {
			const response = await fetch(`/api/get-posts/${postId}/comment`);
			if (!response.ok) throw new Error('Failed to fetch comments');
			const data = await response.json();
			setComments(data);
		} catch (error) {
			console.error('Error fetching comments:', error);
			toast({
				title: 'Error',
				description: 'Failed to load comments',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchComments();
	}, [postId]);

	const onSubmit = async (values: z.infer<typeof commentSchema>) => {
		try {
			const response = await fetch(`/api/get-posts/${postId}/comment`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					body: values.body,
				}),
			});

			if (!response.ok) throw new Error('Failed to post comment');

			form.reset();
			fetchComments(); // Refresh comments
			toast({
				title: 'Success',
				description: 'Comment posted successfully',
				variant: 'success',
			});
		} catch (error) {
			console.error('Error posting comment:', error);
			toast({
				title: 'Error',
				description: 'Failed to post comment',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="space-y-6">
			{currentUserId && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="body"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea placeholder="Write a comment..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							Post Comment
						</Button>
					</form>
				</Form>
			)}

			<div className="space-y-4">
				{isLoading ? (
					<p>Loading comments...</p>
				) : comments.length === 0 ? (
					<p className="text-muted-foreground">No comments yet</p>
				) : (
					comments.map((comment) => (
						<Comment key={comment.id} comment={comment} postId={postId} currentUserId={currentUserId} onCommentUpdate={fetchComments} />
					))
				)}
			</div>
		</div>
	);
}
