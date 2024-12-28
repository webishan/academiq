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
			<Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
				<BiSolidUpvote className="h-5 w-5" />
			</Button>
			<span className="text-sm font-medium">{0}</span>
			<Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
				<BiSolidDownvote className="h-5 w-5" />
			</Button>
			<span className="text-sm font-medium">{0}</span>
		</div>
	);
}

function CommentButton() {
	return (
		<Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary flex items-center gap-2">
			<FaRegComment className="h-4 w-4" />
			<span className="text-sm">{0}</span>
		</Button>
	);
}

function BookmarkButton() {
	return (
		<Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary ml-auto">
			<FaRegBookmark className="h-4 w-4" />
		</Button>
	);
}
