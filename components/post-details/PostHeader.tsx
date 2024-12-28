import { PostWithUser } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit, FaTrash, FaFlag, FaShare, FaUser, FaGraduationCap, FaChalkboardTeacher, FaBuilding, FaIdCard } from 'react-icons/fa';

interface PostHeaderProps {
	post: PostWithUser;
	currentUserId?: string;
}

export function PostHeader({ post, currentUserId }: PostHeaderProps) {
	const isAuthor = currentUserId === post.userId;

	return (
		<div className="bg-transparent p-6">
			<div className="flex items-center justify-between mb-4">
				<Badge variant="secondary" className="px-3 py-1 text-lg">
					{post.courseCode}
				</Badge>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<BsThreeDotsVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{isAuthor && (
								<>
									<DropdownMenuItem>
										<FaEdit className="mr-2" /> Edit
									</DropdownMenuItem>
									<DropdownMenuItem className="text-destructive">
										<FaTrash className="mr-2" /> Delete
									</DropdownMenuItem>
								</>
							)}
							<DropdownMenuItem>
								<FaFlag className="mr-2" /> Report
							</DropdownMenuItem>
							<DropdownMenuItem>
								<FaShare className="mr-2" /> Share
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<h1 className="text-2xl font-bold mb-4">{post.title}</h1>
			<div className="space-y-1 bg-gray-bg py-6 px-4 rounded-xl">
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
