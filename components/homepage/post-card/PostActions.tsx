import { Button } from '@/components/ui/button';
import { BiSolidUpvote, BiSolidDownvote } from 'react-icons/bi';
import { FaRegComment, FaRegBookmark } from 'react-icons/fa';

interface PostActionsProps {
	commentCount: number;
}

export function PostActions({ commentCount }: PostActionsProps) {
	return (
		<div className="border-t px-4 py-2">
			<div className="flex items-center gap-2">
				<div className="flex items-center">
					<Button variant="icon" size="icon" className="hover:text-green-400">
						<BiSolidUpvote />
					</Button>
					<span className="text-sm font-medium">{0}</span>
					<Button variant="icon" size="icon" className="hover:text-red-400">
						<BiSolidDownvote />
					</Button>
					<span className="text-sm font-medium">{0}</span>
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
