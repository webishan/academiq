'use client';

import { PostWithUser } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { BiSolidUpvote } from 'react-icons/bi';
import { BiSolidDownvote } from 'react-icons/bi';
import { FaRegComment } from 'react-icons/fa';

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

			<div className="flex items-center gap-4 mt-4 border-t pt-3">
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

				<Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary flex items-center gap-2">
					<FaRegComment className="h-4 w-4" />
					<span className="text-sm">{0}</span>
				</Button>
			</div>
		</div>
	);
}
