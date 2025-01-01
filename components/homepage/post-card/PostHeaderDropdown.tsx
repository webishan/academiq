'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit, FaTrash, FaFlag, FaShare } from 'react-icons/fa';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ReportDialog } from '@/components/common/ReportDialog';

interface PostHeaderDropdownProps {
	postId: string;
	isAuthor: boolean;
}

export function PostHeaderDropdown({ postId, isAuthor }: PostHeaderDropdownProps) {
	const router = useRouter();
	const { toast } = useToast();

	const handleDelete = async () => {
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
			router.replace('/');
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
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<DropdownMenuItem className="group text-white cursor-pointer" onSelect={(e) => e.preventDefault()}>
									<FaTrash className="h-4 w-4 mr-2 text-white group-hover:text-red-500 transition-colors" />
									<span className="text-white group-hover:text-red-500 transition-colors">Delete</span>
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>This action cannot be undone. This will permanently delete your post.</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				)}
				<ReportDialog
					postId={postId}
					trigger={
						<DropdownMenuItem className="group text-white cursor-pointer" onSelect={(e) => e.preventDefault()}>
							<FaFlag className="h-4 w-4 mr-2 text-white group-hover:text-yellow-500 transition-colors" />
							<span className="text-white group-hover:text-yellow-500 transition-colors">Report</span>
						</DropdownMenuItem>
					}
				/>
				<DropdownMenuItem className="group text-white cursor-pointer">
					<FaShare className="h-4 w-4 mr-2 text-white group-hover:text-green-400 transition-colors" />
					<span className="text-white group-hover:text-green-400 transition-colors">Share</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
