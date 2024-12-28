import { PostWithUser } from '@/types/types';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostFooter } from './PostFooter';
import CommentSection from './CommentSection';
interface PostDetailsProps {
	post: PostWithUser;
	currentUserId?: string;
	currentUser?: {
		name: string;
		image?: string | null;
	};
}

export function PostDetails({ post, currentUserId, currentUser }: PostDetailsProps) {
	// console.log('PostDetails currentUser:', currentUser);
	return (
		<div className="w-full bg-transparent">
			<PostHeader post={post} currentUserId={currentUserId} />
			<PostContent post={post} />
			<PostFooter post={post} currentUserId={currentUserId} />
			<CommentSection postId={post.id} currentUserId={currentUserId} currentUser={currentUser} />
		</div>
	);
}
