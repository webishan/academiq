import { PostWithUser } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { BiSolidUpvote } from 'react-icons/bi';
import { BiSolidDownvote } from 'react-icons/bi';
import { FaRegComment } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FaEdit, FaTrash, FaFlag, FaShare, FaExpand } from 'react-icons/fa';

interface PostCardProps {
	post: PostWithUser;
}

export default function PostCard({ post }: PostCardProps) {
	const formatTimeAgo = (date: Date) => {
		const formatted = formatDistanceToNow(date, { addSuffix: true })
			.replace('about ', '')
			.replace(' hours ago', 'h')
			.replace(' hour ago', 'h')
			.replace(' minutes ago', 'min')
			.replace(' minute ago', 'min')
			.replace(' seconds ago', 's ago')
			.replace(' second ago', 's ago')
			.replace(' days ago', 'd')
			.replace(' day ago', 'd')
			.replace(' months ago', 'mon')
			.replace(' month ago', 'mon')
			.replace(' years ago', 'yr')
			.replace(' year ago', 'yr');
		return formatted;
	};

	return (
		<div className="w-full rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start mb-2">
				<div className="flex-1">
					<Link href={`/post/${post.id}`} className="hover:underline">
						<h2 className="text-xl font-semibold">{post.title}</h2>
					</Link>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">{formatTimeAgo(new Date(post.createdAt))}</span>
					<Link href={`/post/${post.id}`}>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<FaExpand className="h-4 w-4" />
							<span className="sr-only">View full post</span>
						</Button>
					</Link>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<BsThreeDotsVertical className="h-4 w-4" />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<FaEdit className="h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem className="text-destructive">
								<FaTrash className="h-4 w-4" />
								Delete
							</DropdownMenuItem>
							<DropdownMenuItem>
								<FaFlag className="h-4 w-4" />
								Report
							</DropdownMenuItem>
							<DropdownMenuItem>
								<FaShare className="h-4 w-4" />
								Share
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

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

				<Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary ml-auto">
					<FaRegBookmark className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}

// TODO: Add a button to view the post in full screen
