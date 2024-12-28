import { PostWithUser } from '@/types/types';
import { Badge } from '../ui/badge';
import { FaFileAlt } from 'react-icons/fa';

interface PostContentProps {
	post: PostWithUser;
}

export function PostContent({ post }: PostContentProps) {
	return (
		<div className="pt-6 px-6">
			<div className="prose prose-invert max-w-none">
				<p className="text-foreground whitespace-pre-wrap">{post.body}</p>
			</div>

			{post.materials && post.materials.length > 0 && (
				<div className="p-4 bg-muted/20 rounded-lg">
					<h3 className="text-lg font-semibold mb-3">Attachments</h3>
					<div className="grid gap-2">
						{post.materials.map((url: string, index: number) => (
							<a
								key={index}
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 p-2 bg-background/50 rounded hover:bg-background/80 transition-colors"
							>
								<FaFileAlt className="text-primary" />
								<span className="text-primary">Attachment {index + 1}</span>
							</a>
						))}
					</div>
				</div>
			)}

			<div className="flex flex-wrap gap-2 mt-8 mb-4">
				{post.topics.map((topic: string, index: number) => (
					<Badge key={index} variant="dark" className="text-xs rounded-full text-muted-foreground">
						{topic}
					</Badge>
				))}
			</div>
		</div>
	);
}
