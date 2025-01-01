import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaLink, FaTwitter, FaFacebook, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
	postId: string;
	trigger: React.ReactNode;
}

export function ShareDialog({ postId, trigger }: ShareDialogProps) {
	const { toast } = useToast();
	const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/post/${postId}`;

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(postUrl);
			toast({
				title: 'Success',
				description: 'Link copied to clipboard',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to copy link',
				variant: 'destructive',
			});
		}
	};

	// const shareLinks = {
	// 	twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`,
	// 	facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
	// 	whatsapp: `https://wa.me/?text=${encodeURIComponent(postUrl)}`,
	// 	linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
	// };

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share Post</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="bg-transparent rounded-lg">
						<code className="bg-transparent p-2 rounded border text-sm block overflow-x-auto">{postUrl}</code>
					</div>
					<Button variant="outline" className="flex items-center gap-2" onClick={handleCopyLink}>
						<FaLink className="h-4 w-4" />
						Copy Link
					</Button>
					{/* <div className="flex justify-between">
						<Button variant="outline" className="flex-1 mx-1 hover:text-blue-400" onClick={() => window.open(shareLinks.twitter, '_blank')}>
							<FaTwitter className="h-5 w-5" />
						</Button>
						<Button variant="outline" className="flex-1 mx-1 hover:text-blue-600" onClick={() => window.open(shareLinks.facebook, '_blank')}>
							<FaFacebook className="h-5 w-5" />
						</Button>
						<Button variant="outline" className="flex-1 mx-1 hover:text-green-500" onClick={() => window.open(shareLinks.whatsapp, '_blank')}>
							<FaWhatsapp className="h-5 w-5" />
						</Button>
						<Button variant="outline" className="flex-1 mx-1 hover:text-blue-700" onClick={() => window.open(shareLinks.linkedin, '_blank')}>
							<FaLinkedin className="h-5 w-5" />
						</Button>
					</div> */}
				</div>
			</DialogContent>
		</Dialog>
	);
}
