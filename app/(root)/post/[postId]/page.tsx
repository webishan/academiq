import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import PageWrapper from '@/components/common/PageWrapper';
import { PostDetails } from '@/components/post-details/PostDetails';

async function getPost(postId: string) {
	const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/get-posts/${postId}`;
	console.log('Fetching post from:', url);

	const response = await fetch(url, {
		cache: 'no-store',
		next: { revalidate: 0 },
	});

	console.log('Response status:', response.status);

	if (!response.ok) {
		if (response.status === 404) {
			console.log('Post not found');
			notFound();
		}
		const errorData = await response.json();
		console.error('Error response:', errorData);
		throw new Error(`Failed to fetch post: ${errorData.error || response.statusText}`);
	}

	const data = await response.json();
	console.log('Fetched post data:', data);
	return data;
}

export default async function PostDetailPage({ params }: { params: { postId: string } }) {
	const session = await auth();
	const currentUserId = session?.user?.id;
	const post = await getPost(params.postId);

	return (
		<PageWrapper>
			<div className="container mx-auto py-8 px-4">
				<div className="max-w-6xl mx-auto">
					<PostDetails post={post} currentUserId={currentUserId} />
				</div>
			</div>
		</PageWrapper>
	);
}
