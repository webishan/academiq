import { PostWithUser } from '@/types/types';
import Link from 'next/link';
import { PostHeader } from './post-card/PostHeader';
import { PostActions } from './post-card/PostActions';
import { Badge } from '../ui/badge';
import { FaFileAlt, FaImage } from 'react-icons/fa';
import Image from 'next/image';

interface PostCardProps {
	post: PostWithUser;
	currentUserId?: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
	const renderMaterialPreview = (url: string) => {
		const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
		const isPDF = url.includes('.pdf');
		const isDoc = url.includes('.doc') || url.includes('.docx');

		if (isImage) {
			return (
				<div className="relative h-32 w-32 rounded-md overflow-hidden">
					<Image src={url} alt="Attached image" fill className="object-cover" />
				</div>
			);
		}

		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
			>
				<FaFileAlt className="h-4 w-4" />
				<span className="text-sm">{isPDF ? 'PDF Document' : isDoc ? 'Word Document' : 'File'}</span>
			</a>
		);
	};

	return (
		<div className="w-full rounded-lg border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
			<PostHeader post={post} currentUserId={currentUserId} />

			<div className="flex-1 flex flex-col px-4">
				<p className="text-sm text-foreground my-3 line-clamp-2">{post.body}</p>

				{post.materials && post.materials.length > 0 && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<FaFileAlt className="h-4 w-4" />
						<span>
							{post.materials.length} attachment{post.materials.length > 1 ? 's' : ''}
						</span>
					</div>
				)}
			</div>

			<div className="flex flex-wrap gap-2 mb-3 mt-auto px-4">
				{post.topics.map((topic, index) => (
					<Badge key={index} variant="dark" className="text-xs rounded-full text-muted-foreground">
						{topic}
					</Badge>
				))}
			</div>

			<PostActions postId={post.id} commentCount={post._count?.comments || 0} currentUserId={currentUserId} />
		</div>
	);
}
