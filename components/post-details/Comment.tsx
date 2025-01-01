'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { FaReply, FaChevronDown, FaChevronRight, FaFlag } from 'react-icons/fa';
import Link from 'next/link';
import { Avatar } from '../ui/avatar';
import { BiSolidUpvote, BiSolidDownvote } from 'react-icons/bi';
import { CommentReply } from './CommentReply';
import debounce from 'lodash/debounce';
import { ReportDialog } from '@/components/common/ReportDialog';

const replySchema = z.object({
	body: z.string().min(1, 'Reply cannot be empty'),
});

interface CommentProps {
	comment: any;
	postId: string;
	currentUserId?: string;
	onCommentUpdate: () => void;
}

interface VoteResponse {
	upvotes: number;
	downvotes: number;
}

interface VoteContext {
	previousVote: number;
	previousUpvotes: number;
	previousDownvotes: number;
}

export function Comment({ comment, postId, currentUserId, onCommentUpdate }: CommentProps) {
	const [isReplying, setIsReplying] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isVoting, setIsVoting] = useState(false);
	const { toast } = useToast();
	const hasReplies = comment.children && comment.children.length > 0;
	const [userVote, setUserVote] = useState<number>(0);
	const [upvotes, setUpvotes] = useState<number>(0);
	const [downvotes, setDownvotes] = useState<number>(0);

	const form = useForm<z.infer<typeof replySchema>>({
		resolver: zodResolver(replySchema),
		defaultValues: {
			body: '',
		},
	});

	useEffect(() => {
		if (currentUserId) {
			fetchVotes();
		}
	}, [comment.id, currentUserId]);

	const fetchVotes = async () => {
		try {
			const response = await fetch(`/api/comments/${comment.id}/vote`);
			if (!response.ok) throw new Error('Failed to fetch votes');
			const data = await response.json();
			setUserVote(data.userVote);
			setUpvotes(data.upvotes);
			setDownvotes(data.downvotes);
		} catch (error) {
			console.error('Error fetching votes:', error);
		}
	};

	const submitVote = async (value: number): Promise<VoteResponse> => {
		const response = await fetch(`/api/comments/${comment.id}/vote`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ value }),
		});
		if (!response.ok) throw new Error('Failed to vote');
		return response.json();
	};

	const handleOptimisticUpdate = (value: number): VoteContext => {
		const previousVote = userVote;
		const previousUpvotes = upvotes;
		const previousDownvotes = downvotes;

		if (value === previousVote) {
			setUserVote(0);
			setUpvotes(value === 1 ? upvotes - 1 : upvotes);
			setDownvotes(value === -1 ? downvotes - 1 : downvotes);
		} else {
			setUserVote(value);
			if (value === 1) {
				setUpvotes(upvotes + 1);
				if (previousVote === -1) setDownvotes(downvotes - 1);
			} else {
				setDownvotes(downvotes + 1);
				if (previousVote === 1) setUpvotes(upvotes - 1);
			}
		}

		return { previousVote, previousUpvotes, previousDownvotes };
	};

	const handleError = (context: VoteContext) => {
		setUserVote(context.previousVote);
		setUpvotes(context.previousUpvotes);
		setDownvotes(context.previousDownvotes);
		toast({
			title: 'Error',
			description: 'Failed to process vote',
			variant: 'destructive',
		});
	};

	const debouncedVote = useCallback(
		debounce(async (value: number) => {
			if (!isVoting) {
				setIsVoting(true);
				const context = handleOptimisticUpdate(value);
				try {
					const result = await submitVote(value);
					setUpvotes(result.upvotes);
					setDownvotes(result.downvotes);
				} catch (error) {
					handleError(context);
				} finally {
					setIsVoting(false);
				}
			}
		}, 300),
		[isVoting, userVote, upvotes, downvotes],
	);

	const handleVote = (value: number) => {
		if (!currentUserId) {
			toast({
				title: 'Authentication required',
				description: 'Please login to vote',
				variant: 'destructive',
			});
			return;
		}
		debouncedVote(value);
	};

	const onSubmitReply = async (values: z.infer<typeof replySchema>) => {
		try {
			const response = await fetch(`/api/get-posts/${postId}/comment`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					body: values.body,
					parentId: comment.id,
				}),
			});

			if (!response.ok) throw new Error('Failed to post reply');

			form.reset();
			setIsReplying(false);
			onCommentUpdate();
			toast({
				title: 'Success',
				description: 'Reply posted successfully',
				variant: 'success',
			});
		} catch (error) {
			console.error('Error posting reply:', error);
			toast({
				title: 'Error',
				description: 'Failed to post reply',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="space-y-4">
			<div className="bg-secondary/15 p-4 rounded-3xl">
				<div className="flex gap-3">
					<Avatar src={comment.user.image} name={comment.user.name} />
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<Link href={`/profile/${comment.user.id}`} className="font-semibold text-accent hover:text-secondary transition-colors">
								{comment.user.name}
							</Link>
							<span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
						</div>
						<p className="text-sm mb-3 whitespace-pre-wrap">{comment.body}</p>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="sm"
									className={`hover:text-green-400 ${userVote === 1 ? 'text-green-400' : ''}`}
									onClick={() => handleVote(1)}
									disabled={isVoting}
								>
									<BiSolidUpvote className="h-3 w-3" />
									<span className="ml-1 text-xs">{upvotes}</span>
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className={`hover:text-red-400 ${userVote === -1 ? 'text-red-400' : ''}`}
									onClick={() => handleVote(-1)}
									disabled={isVoting}
								>
									<BiSolidDownvote className="h-3 w-3" />
									<span className="ml-1 text-xs">{downvotes}</span>
								</Button>
							</div>
							{currentUserId && (
								<>
									<Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-2 hover:text-primary">
										<FaReply className="h-3 w-3" />
										Reply
									</Button>
									<ReportDialog
										commentId={comment.id}
										trigger={
											<Button variant="ghost" size="sm" className="flex items-center gap-2 hover:text-yellow-500">
												<FaFlag className="h-3 w-3" />
												Report
											</Button>
										}
									/>
								</>
							)}
							{hasReplies && (
								<Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 hover:text-primary">
									{isExpanded ? <FaChevronDown className="h-3 w-3" /> : <FaChevronRight className="h-3 w-3" />}
									{comment.children.length} {comment.children.length === 1 ? 'reply' : 'replies'}
								</Button>
							)}
						</div>

						{isReplying && (
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmitReply)} className="mt-4 space-y-4">
									<FormField
										control={form.control}
										name="body"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														placeholder="Write a reply..."
														className="min-h-[50px] border-[0.5px] border-transparent resize-none bg-gray-bg focus-visible:ring-0 focus-visible:border-secondary rounded-xl"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex gap-2">
										<Button type="submit" size="sm" disabled={form.formState.isSubmitting} variant="secondary">
											{form.formState.isSubmitting ? 'Posting...' : 'Post Reply'}
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setIsReplying(false)}
											className="hover:text-red-500 hover:bg-transparent"
										>
											Cancel
										</Button>
									</div>
								</form>
							</Form>
						)}
					</div>
				</div>
			</div>

			{hasReplies && isExpanded && (
				<div className="ml-14 space-y-4 border-l-2 border-gray-700 pl-4 bg-secondary/20">
					{comment.children.map((reply: any) => (
						<div key={reply.id} className="bg-muted/10 p-4">
							<CommentReply reply={reply} currentUserId={currentUserId} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
