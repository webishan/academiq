import { PostWithUser } from '@/types/types';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostActions } from '../homepage/post-card/PostActions';
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
			<div className="mx-6">
				<PostActions postId={post.id} commentCount={post._count?.comments || 0} currentUserId={currentUserId} />
			</div>
			<CommentSection postId={post.id} currentUserId={currentUserId} currentUser={currentUser} />
		</div>
	);
}
