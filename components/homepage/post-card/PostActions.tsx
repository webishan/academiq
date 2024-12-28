import { Button } from '@/components/ui/button';
import { BiSolidUpvote, BiSolidDownvote } from 'react-icons/bi';
import { FaRegComment, FaRegBookmark } from 'react-icons/fa';

export function PostActions() {
	return (
		<div className="flex items-center gap-4 mt-4 border-t pt-3">
			<VoteButtons />
			<CommentButton />
			<BookmarkButton />
		</div>
	);
}

function VoteButtons() {
	return (
		<div className="flex items-center gap-1">
			<Button variant="icon" size="icon" className="hover:text-green-400">
				<BiSolidUpvote />
			</Button>
			<span className="text-sm font-medium">{0}</span>
			<Button variant="icon" size="icon" className="hover:text-red-400">
				<BiSolidDownvote />
			</Button>
			<span className="text-sm font-medium">{0}</span>
		</div>
	);
}

function CommentButton() {
	return (
		<div className="flex items-center gap-1">
			<Button variant="icon" size="icon" className="hover:text-red-400">
				<FaRegComment />
			</Button>
			<span className="text-sm font-medium">{0}</span>
		</div>
	);
}

function BookmarkButton() {
	return (
		<Button variant="icon" size="icon" className="hover:text-red-400">
			<FaRegBookmark />
		</Button>
	);
}
