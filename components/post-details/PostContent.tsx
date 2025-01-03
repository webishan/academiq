import { PostWithUser } from '@/types/types';
import { Badge } from '../ui/badge';
import { FaFileAlt, FaFilePdf, FaFileWord, FaFileImage } from 'react-icons/fa';
import Image from 'next/image';

interface PostContentProps {
	post: PostWithUser;
}

const getFileIcon = (url: string) => {
	if (url.match(/\.(pdf)$/i)) {
		return <FaFilePdf className="text-red-500" size={20} />;
	} else if (url.match(/\.(docx|doc)$/i)) {
		return <FaFileWord className="text-blue-500" size={20} />;
	} else if (url.match(/\.(jpg|jpeg|png)$/i)) {
		return <FaFileImage className="text-green-500" size={20} />;
	}
	return <FaFileAlt className="text-gray-500" size={20} />;
};

const getFileName = (url: string) => {
	const parts = url.split('/');
	const fileName = parts[parts.length - 1];
	return fileName.split('?')[0];
};

const isImageFile = (url: string) => {
	return url.match(/\.(jpg|jpeg|png|gif)$/i);
};

export function PostContent({ post }: PostContentProps) {
	return (
		<div className="pt-6 px-6">
			<div className="prose prose-invert max-w-none">
				<p className="text-foreground whitespace-pre-wrap">{post.body}</p>
			</div>

			{post.materials && post.materials.length > 0 && (
				<div className="mt-6 p-4 bg-muted/20 rounded-lg">
					<h3 className="text-md font-semibold mb-3">Attachments</h3>
					<div className="grid gap-3">
						{post.materials.map((url: string, index: number) => (
							<a
								key={index}
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 p-3 bg-background/50 rounded-md hover:bg-background/80 transition-colors group"
							>
								{isImageFile(url) ? (
									<div className="relative w-20 h-20 rounded-md overflow-hidden">
										<Image src={url} alt={getFileName(url)} fill className="object-cover" sizes="80px" />
									</div>
								) : (
									getFileIcon(url)
								)}
								<div className="flex flex-col">
									<span className="text-sm font-medium group-hover:text-primary transition-colors">{getFileName(url)}</span>
									<span className="text-xs text-muted-foreground">Click to view or download</span>
								</div>
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
