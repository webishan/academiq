import { PostWithUser } from '@/types/types';
import { Button } from '../ui/button';
import { BiSolidUpvote, BiSolidDownvote } from 'react-icons/bi';
import { FaRegComment, FaRegBookmark } from 'react-icons/fa';

interface PostFooterProps {
	post: PostWithUser;
	currentUserId?: string;
}

export function PostFooter({ post, currentUserId }: PostFooterProps) {
	return (
		<div className="bg-transparent border-b mx-6 mb-4">
			<div className="flex items-center gap-2">
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
				<Button variant="icon" size="icon" className="hover:text-red-400">
					<FaRegBookmark />
				</Button>
			</div>
		</div>
	);
}
