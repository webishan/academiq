'use client';

import { Button } from '@/components/ui/button';
import { BiSolidUpvote, BiSolidDownvote } from 'react-icons/bi';
import { FaRegComment, FaRegBookmark } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PostActionsProps {
	postId: string;
	commentCount: number;
	currentUserId?: string;
}

export function PostActions({ postId, commentCount, currentUserId }: PostActionsProps) {
	const [userVote, setUserVote] = useState<number>(0);
	const [upvotes, setUpvotes] = useState<number>(0);
	const [downvotes, setDownvotes] = useState<number>(0);
	const { toast } = useToast();

	useEffect(() => {
		if (currentUserId) {
			fetchVotes();
		}
	}, [postId, currentUserId]);

	const fetchVotes = async () => {
		try {
			const response = await fetch(`/api/get-posts/${postId}/vote`);
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
			const response = await fetch(`/api/get-posts/${postId}/vote`, {
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
		<div className="border-t px-4 py-2">
			<div className="flex items-center gap-2">
				<div className="flex items-center">
					<Button
						variant="icon"
						size="icon"
						className={`hover:text-green-400 ${userVote === 1 ? 'text-green-400' : ''}`}
						onClick={() => handleVote(1)}
					>
						<BiSolidUpvote />
					</Button>
					<span className="text-sm font-medium">{upvotes}</span>
					<Button variant="icon" size="icon" className={`hover:text-red-400 ${userVote === -1 ? 'text-red-400' : ''}`} onClick={() => handleVote(-1)}>
						<BiSolidDownvote />
					</Button>
					<span className="text-sm font-medium">{downvotes}</span>
				</div>
				<div className="flex items-center gap-1 ml-2">
					<FaRegComment className="h-4 w-4" />
					<span className="text-sm text-muted-foreground">{commentCount}</span>
				</div>
				<Button variant="icon" size="icon" className="hover:text-red-400">
					<FaRegBookmark />
				</Button>
			</div>
		</div>
	);
}
