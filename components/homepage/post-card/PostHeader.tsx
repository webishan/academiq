import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit, FaTrash, FaFlag, FaShare, FaExpand } from 'react-icons/fa';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { PostWithUser } from '@/types/types';

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
		<div className="flex justify-between items-start mb-2">
			<div className="flex-1">
				<Link href={`/post/${post.id}`} className="no-underline">
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
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<BsThreeDotsVertical className="h-4 w-4" />
							<span className="sr-only">More options</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[200px]">
						{isAuthor && (
							<>
								<DropdownMenuItem>
									<FaEdit className="h-4 w-4 mr-2" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem className="text-destructive">
									<FaTrash className="h-4 w-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</>
						)}
						<DropdownMenuItem>
							<FaFlag className="h-4 w-4 mr-2" />
							Report
						</DropdownMenuItem>
						<DropdownMenuItem>
							<FaShare className="h-4 w-4 mr-2" />
							Share
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
