import PostCard from '@/components/homepage/PostCard';
import { PostWithUser } from '@/types/types';
import { auth } from '@/lib/auth';

interface SearchParams {
	q?: string;
	hasLink?: string;
	hasMaterial?: string;
	fromDate?: string;
	toDate?: string;
}

async function getPosts(searchParams: SearchParams) {
	try {
		const queryString = new URLSearchParams({
			...(searchParams.q && { q: searchParams.q }),
			...(searchParams.hasLink && { hasLink: searchParams.hasLink }),
			...(searchParams.hasMaterial && { hasMaterial: searchParams.hasMaterial }),
			...(searchParams.fromDate && { fromDate: searchParams.fromDate }),
			...(searchParams.toDate && { toDate: searchParams.toDate }),
		}).toString();

		const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/get-posts${queryString ? `?${queryString}` : ''}`, {
			cache: 'no-store',
			next: { revalidate: 0 },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch posts: ${response.statusText}`);
		}

		const data = await response.json();

		if (!Array.isArray(data)) {
			throw new Error('Invalid data format received from API');
		}

		return data;
	} catch (error) {
		console.error('Error fetching posts:', error);
		return null;
	}
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
	const session = await auth();
	const currentUserId = session?.user?.id;
	const posts = await getPosts(searchParams);

	if (!posts) {
		return (
			<main className="container mx-auto py-8 px-4">
				<div className="w-full flex justify-center items-center h-[50vh]">
					<p>Error loading posts</p>
				</div>
			</main>
		);
	}

	return (
		<main className="container mx-auto py-8 px-4">
			<div className="w-full flex justify-between items-center max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">{searchParams.q ? `Search Results for "${searchParams.q}"` : 'Recent Posts'}</h1>
			</div>
			<div className="grid gap-4 grid-cols-1 gap-y-8 max-w-4xl mx-auto">
				{posts.length === 0 ? (
					<p className="text-center text-muted-foreground">No posts found</p>
				) : (
					posts.map((post: PostWithUser) => <PostCard key={post.id} post={post} currentUserId={currentUserId} />)
				)}
			</div>
		</main>
	);
}
