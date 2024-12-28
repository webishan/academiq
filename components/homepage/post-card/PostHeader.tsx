import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit, FaTrash, FaFlag, FaShare, FaExpand } from 'react-icons/fa';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { PostWithUser } from '@/types/types';
import { cn } from '@/lib/utils';

interface PostHeaderProps {
	post: PostWithUser;
	currentUserId?: string;
}

export function PostHeader({ post, currentUserId }: PostHeaderProps) {
	const isAuthor = currentUserId === post.userId;

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
		<div className="w-full">
			<div className="flex justify-between items-start mb-2 w-full">
				<div className="flex-1">
					<Link href={`/post/${post.id}`} className="no-underline">
						<h2 className="text-xl font-semibold hover:text-violet-200 transition-all duration-500">{post.title}</h2>
					</Link>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">{formatTimeAgo(new Date(post.createdAt))}</span>
					<Link href={`/post/${post.id}`}>
						<Button variant="icon" size="icon" className="hover:text-purple-400">
							<FaExpand className="h-4 w-4" />
							<span className="sr-only">View full post</span>
						</Button>
					</Link>
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild className="outline-none">
							<Button variant="icon" size="icon" className="hover:text-purple-400">
								<BsThreeDotsVertical className="h-4 w-4" />
								<span className="sr-only">More options</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[200px]">
							{isAuthor && (
								<>
									<DropdownMenuItem className="group text-white cursor-pointer">
										<FaEdit className="h-4 w-4 mr-2 text-white group-hover:text-blue-400 transition-colors" />
										<span className="text-white group-hover:text-blue-400 transition-colors">Edit</span>
									</DropdownMenuItem>
									<DropdownMenuItem className="group text-white cursor-pointer">
										<FaTrash className="h-4 w-4 mr-2 text-white group-hover:text-red-500 transition-colors" />
										<span className="text-white group-hover:text-red-500 transition-colors">Delete</span>
									</DropdownMenuItem>
								</>
							)}
							<DropdownMenuItem className="group text-white cursor-pointer">
								<FaFlag className="h-4 w-4 mr-2 text-white group-hover:text-yellow-500 transition-colors" />
								<span className="text-white group-hover:text-yellow-500 transition-colors">Report</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="group text-white cursor-pointer">
								<FaShare className="h-4 w-4 mr-2 text-white group-hover:text-green-400 transition-colors" />
								<span className="text-white group-hover:text-green-400 transition-colors">Share</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div>
				<div className="flex items-center gap-2">
					<Link href={`/profile/${post.user.id}`} className="text-primary hover:underline font-bold">
						{post.user.name}
					</Link>
					{post.user.role && <span>{post.user.role.charAt(0).toUpperCase() + post.user.role.slice(1).toLowerCase()}</span>}
				</div>
				<div className="flex items-center gap-2">Course: {post.courseCode}</div>
			</div>
		</div>
	);
}
