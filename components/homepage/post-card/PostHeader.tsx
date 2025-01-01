import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit, FaTrash, FaFlag, FaShare, FaExpand, FaUser, FaGraduationCap, FaBuilding, FaChalkboardTeacher, FaIdCard } from 'react-icons/fa';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { PostWithUser } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { PostHeaderDropdown } from './PostHeaderDropdown';

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
		<div className="w-full bg-gray-bg p-4">
			<Badge variant="secondary" className="mb-2 rounded-full">
				<span className="uppercase font-bold text-md">{post.courseCode}</span>
			</Badge>
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
					<PostHeaderDropdown postId={post.id} isAuthor={isAuthor} />
				</div>
			</div>
			<div className="space-y-1">
				<div className="flex flex-wrap items-center gap-4 text-sm">
					<Link href={`/profile/${post.user.id}`} className="flex items-center gap-2 text-primary hover:underline font-bold">
						<FaUser className="h-4 w-4" />
						{post.user.name}
						{post.user.role === 'FACULTY' && post.user.facultyInitials && (
							<span className="text-muted-foreground">({post.user.facultyInitials})</span>
						)}
					</Link>
					{post.user.role && (
						<span className="flex items-center gap-2 text-muted-foreground">
							{post.user.role === 'STUDENT' ? <FaGraduationCap className="h-4 w-4" /> : <FaChalkboardTeacher className="h-4 w-4" />}
							{post.user.role.charAt(0).toUpperCase() + post.user.role.slice(1).toLowerCase()}
						</span>
					)}
					{post.user.department && (
						<span className="flex items-center gap-2 text-muted-foreground">
							<FaBuilding className="h-4 w-4" />
							{post.user.department}
						</span>
					)}
					{post.user.role === 'FACULTY' && post.user.facultyPosition && (
						<span className="flex items-center gap-2 text-muted-foreground">
							<FaIdCard className="h-4 w-4" />
							{post.user.facultyPosition}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
