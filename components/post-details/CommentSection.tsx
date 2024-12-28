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
import { FaRegComment } from 'react-icons/fa';

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
			fetchComments();
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
		<div className="px-6 mt-10">
			{currentUserId && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="body"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="Write a comment..."
											className="min-h-[50px] border-[0.5px] border-transparent resize-none bg-gray-bg focus-visible:ring-0 focus-visible:border-secondary rounded-xl"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto" variant="secondary">
								{form.formState.isSubmitting ? 'Posting...' : 'Post Comment'}
							</Button>
						</div>
					</form>
				</Form>
			)}
			<div className="flex items-center gap-2 pb-4">
				<FaRegComment className="h-5 w-5" />
				<h2 className="text-xl font-semibold">Comments</h2>
				<span className="text-sm text-muted-foreground">({comments.length})</span>
			</div>

			<div className="space-y-6">
				{isLoading ? (
					<div className="flex justify-center py-8">
						<p className="text-muted-foreground">Loading comments...</p>
					</div>
				) : comments.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<p className="text-muted-foreground">No comments yet</p>
						{currentUserId && <p className="text-sm text-muted-foreground mt-1">Be the first to comment!</p>}
					</div>
				) : (
					comments.map((comment) => (
						<Comment key={comment.id} comment={comment} postId={postId} currentUserId={currentUserId} onCommentUpdate={fetchComments} />
					))
				)}
			</div>
		</div>
	);
}
