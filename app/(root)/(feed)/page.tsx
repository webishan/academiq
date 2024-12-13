import PostCard from '@/components/homepage/PostCard';
import { PostWithUser } from '@/types/types';

async function getPosts() {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/get-posts`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Failed to fetch posts');
		}

		return response.json();
	} catch (error) {
		console.error('Error:', error);
		return [];
	}
}

export default async function Home() {
	const posts = await getPosts();

	return (
		<main className="container mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-8">Recent Posts</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{posts.map((post: PostWithUser) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</main>
	);
}
