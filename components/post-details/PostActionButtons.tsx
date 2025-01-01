'use client';

import { Button } from '@/components/ui/button';
import { FaEdit, FaTrash, FaFlag, FaShare } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface PostActionButtonsProps {
	postId: string;
	isAuthor: boolean;
}

export function PostActionButtons({ postId, isAuthor }: PostActionButtonsProps) {
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
		<>
			{isAuthor && (
				<>
					<Button variant="icon" size="icon" className="hover:text-blue-400 hover:bg-gray-bg" onClick={() => router.push(`/post/${postId}/edit`)}>
						<FaEdit className="h-4 w-4" />
					</Button>
					<Button variant="icon" size="icon" className="hover:text-red-500 hover:bg-gray-bg" onClick={handleDelete}>
						<FaTrash className="h-4 w-4" />
					</Button>
				</>
			)}
			<Button variant="icon" size="icon" className="hover:text-yellow-500 hover:bg-gray-bg">
				<FaFlag className="h-4 w-4" />
			</Button>
			<Button variant="icon" size="icon" className="hover:text-green-400 hover:bg-gray-bg">
				<FaShare className="h-4 w-4" />
			</Button>
		</>
	);
}
