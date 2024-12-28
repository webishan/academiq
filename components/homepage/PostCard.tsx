import { PostWithUser } from '@/types/types';
import Link from 'next/link';
import { PostHeader } from './post-card/PostHeader';
import { PostActions } from './post-card/PostActions';
import { auth } from '@/lib/auth';
import { Badge } from '../ui/badge';

interface PostCardProps {
	post: PostWithUser;
}

export default async function PostCard({ post }: PostCardProps) {
	const session = await auth();
	const currentUserId = session?.user?.id;

	return (
		<div className="w-full rounded-lg border shadow-sm hover:shadow-md transition-shadow">
			<PostHeader post={post} currentUserId={currentUserId} />

			<p className="text-sm text-foreground my-3 line-clamp-2 px-4">{post.body}</p>

			<div className="flex flex-wrap gap-2 mb-3 px-4">
				{post.topics.map((topic, index) => (
					<Badge key={index} variant="dark" className="text-xs rounded-full text-muted-foreground">
						{topic}
					</Badge>
				))}
			</div>

			{/* <div className="flex items-center gap-2">
				{post.hasMaterial && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Has attachments</span>}
				{post.hasLink && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Contains links</span>}
			</div> */}

			<PostActions />
		</div>
	);
}
