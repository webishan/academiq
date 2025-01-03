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
				</div>
			</DialogContent>
		</Dialog>
	);
}
