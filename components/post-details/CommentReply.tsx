'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { BiSolidUpvote, BiSolidDownvote } from 'react-icons/bi';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import { ReportDialog } from '@/components/common/ReportDialog';
import { FaFlag } from 'react-icons/fa';
import { Badge } from '../ui/badge';

interface CommentReplyProps {
	reply: any;
	currentUserId?: string;
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

export function CommentReply({ reply, currentUserId }: CommentReplyProps) {
	const [userVote, setUserVote] = useState<number>(0);
	const [upvotes, setUpvotes] = useState<number>(0);
	const [downvotes, setDownvotes] = useState<number>(0);
	const [isVoting, setIsVoting] = useState<boolean>(false);
	const { toast } = useToast();

	useEffect(() => {
		if (currentUserId) {
			fetchVotes();
		}
	}, [reply.id, currentUserId]);

	const fetchVotes = async () => {
		try {
			const response = await fetch(`/api/comments/${reply.id}/vote`);
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
		const response = await fetch(`/api/comments/${reply.id}/vote`, {
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

	return (
		<div className="flex gap-3">
			<Avatar src={reply.user.image} name={reply.user.name} />
			<div className="flex-1">
				<div className="flex items-center gap-2 mb-2">
					<Link href={`/profile/${reply.user.id}`} className="font-semibold text-accent hover:text-secondary transition-colors">
						{reply.user.name}
					</Link>
					<Badge variant="dark" className="text-[10px] rounded-full text-muted-foreground">
						{reply.user.role}
					</Badge>
					<span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
				</div>
				<p className="text-sm whitespace-pre-wrap mb-2">{reply.body}</p>
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
					{currentUserId && (
						<ReportDialog
							commentId={reply.id}
							trigger={
								<Button variant="ghost" size="sm" className="flex items-center gap-2 hover:text-yellow-500">
									<FaFlag className="h-3 w-3" />
									Report
								</Button>
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
