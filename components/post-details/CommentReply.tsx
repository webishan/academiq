'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { BiSolidUpvote, BiSolidDownvote } from 'react-icons/bi';
import { useToast } from '@/hooks/use-toast';

interface CommentReplyProps {
	reply: any;
	currentUserId?: string;
}

export function CommentReply({ reply, currentUserId }: CommentReplyProps) {
	const [userVote, setUserVote] = useState<number>(0);
	const [upvotes, setUpvotes] = useState<number>(0);
	const [downvotes, setDownvotes] = useState<number>(0);
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

	const handleVote = async (value: number) => {
		if (!currentUserId) {
			toast({
				title: 'Authentication required',
				description: 'Please login to vote',
				variant: 'destructive',
			});
			return;
		}

		try {
			const response = await fetch(`/api/comments/${reply.id}/vote`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ value }),
			});

			if (!response.ok) throw new Error('Failed to vote');

			const data = await response.json();
			setUpvotes(data.upvotes);
			setDownvotes(data.downvotes);
			setUserVote(value === userVote ? 0 : value);
		} catch (error) {
			console.error('Error voting:', error);
			toast({
				title: 'Error',
				description: 'Failed to process vote',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="flex gap-3">
			<Avatar src={reply.user.image} name={reply.user.name} />
			<div className="flex-1">
				<div className="flex items-center gap-2 mb-2">
					<Link href={`/profile/${reply.user.id}`} className="font-semibold text-accent hover:text-secondary transition-colors">
						{reply.user.name}
					</Link>
					<span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
				</div>
				<p className="text-sm whitespace-pre-wrap mb-2">{reply.body}</p>
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						className={`hover:text-green-400 ${userVote === 1 ? 'text-green-400' : ''}`}
						onClick={() => handleVote(1)}
					>
						<BiSolidUpvote className="h-3 w-3" />
						<span className="ml-1 text-xs">{upvotes}</span>
					</Button>
					<Button variant="ghost" size="sm" className={`hover:text-red-400 ${userVote === -1 ? 'text-red-400' : ''}`} onClick={() => handleVote(-1)}>
						<BiSolidDownvote className="h-3 w-3" />
						<span className="ml-1 text-xs">{downvotes}</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
