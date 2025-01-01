'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit, FaTrash, FaFlag, FaShare } from 'react-icons/fa';

interface PostHeaderDropdownProps {
	postId: string;
	isAuthor: boolean;
}

export function PostHeaderDropdown({ postId, isAuthor }: PostHeaderDropdownProps) {
	const router = useRouter();
	const { toast } = useToast();

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this post?')) return;

		try {
			const response = await fetch(`/api/get-posts/${postId}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete post');

			toast({
				title: 'Success',
				description: 'Post deleted successfully',
			});

			router.refresh();
			router.push('/');
		} catch (error) {
			console.error('Error deleting post:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete post',
				variant: 'destructive',
			});
		}
	};

	return (
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
						<DropdownMenuItem className="group text-white cursor-pointer" onClick={() => router.push(`/post/${postId}/edit`)}>
							<FaEdit className="h-4 w-4 mr-2 text-white group-hover:text-blue-400 transition-colors" />
							<span className="text-white group-hover:text-blue-400 transition-colors">Edit</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="group text-white cursor-pointer" onClick={handleDelete}>
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
	);
}
