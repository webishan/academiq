'use client';

import { PostWithUser } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface PostCardProps {
	post: PostWithUser;
}

export default function PostCard({ post }: PostCardProps) {
	return (
		<div className="w-full rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start mb-2">
				<h2 className="text-xl font-semibold">{post.title}</h2>
				<span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
			</div>

			<div className="flex items-center gap-2 mb-3">
				<span className="text-sm font-medium">{post.courseCode}</span>
				<span className="text-sm text-muted-foreground">by {post.user.name}</span>
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
		</div>
	);
}
