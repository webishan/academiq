import { PostWithUser } from '@/types/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PostHeader } from './post-card/PostHeader';
import { PostActions } from './post-card/PostActions';
import { auth } from '@/lib/auth';

interface PostCardProps {
	post: PostWithUser;
}

export default async function PostCard({ post }: PostCardProps) {
	const session = await auth();
	const currentUserId = session?.user?.id;

	return (
		<div className="w-full rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
			<PostHeader post={post} currentUserId={currentUserId} />

			<div className="flex items-center gap-2 mb-3">
				<span className="text-sm font-medium">{post.courseCode}</span>
				<span className="text-sm text-muted-foreground">
					by{' '}
					<Link href={`/profile/${post.user.id}`} className="text-blue-500 hover:underline">
						{post.user.name}
					</Link>
					{post.user.role && (
						<>
							{' • '}
							<span
								className={cn(
									'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
									post.user.role.toLowerCase() === 'student' ? 'bg-blue-100 text-sky-700' : 'bg-violet-100 text-red-700',
								)}
							>
								{post.user.role.charAt(0).toUpperCase() + post.user.role.slice(1).toLowerCase()}
							</span>
						</>
					)}
				</span>
			</div>

			<p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.body}</p>

			<div className="flex flex-wrap gap-2 mb-3">
				{post.topics.map((topic, index) => (
					<span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
						{topic}
					</span>
				))}
			</div>

			<div className="flex items-center gap-2">
				{post.hasMaterial && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Has attachments</span>}
				{post.hasLink && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Contains links</span>}
			</div>

			<PostActions />
		</div>
	);
}
