import PostCard from '@/components/homepage/PostCard';
import { PostWithUser } from '@/types/types';

interface SearchParams {
	q?: string;
}

async function getPosts(searchParams: SearchParams) {
	try {
		const queryString = new URLSearchParams({
			...(searchParams.q && { q: searchParams.q }),
		}).toString();

		const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/get-posts${queryString ? `?${queryString}` : ''}`, {
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

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
	const posts = await getPosts(searchParams);

	return (
		<main className="container mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-8">{searchParams.q ? `Search Results for "${searchParams.q}"` : 'Recent Posts'}</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{posts.map((post: PostWithUser) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</main>
	);
}
