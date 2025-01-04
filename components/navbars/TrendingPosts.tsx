'use client';

import { useEffect, useState } from 'react';
import { PostWithUser } from '@/types/types';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FaUser, FaFire } from 'react-icons/fa';
import { Badge } from '../ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const TrendingPosts = () => {
	const [posts, setPosts] = useState<PostWithUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchTrendingPosts = async () => {
			try {
				const response = await fetch('/api/trending-posts');
				if (!response.ok) throw new Error('Failed to fetch trending posts');
				const data = await response.json();
				setPosts(data);
			} catch (error) {
				console.error('Error fetching trending posts:', error);
				setError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTrendingPosts();
	}, []);

	if (isLoading) {
		return (
			<aside className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-background border-l border-border p-4">
				<div className="pb-4 border-b mb-4">
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-5" />
						<Skeleton className="h-6 w-32" />
					</div>
				</div>
				<div className="space-y-4">
					{[1, 2, 3, 4, 5].map((_, i) => (
						<div key={i} className="p-3 space-y-2">
							<Skeleton className="h-5 w-16" />
							<Skeleton className="h-4 w-full" />
							<div className="flex items-center gap-2">
								<Skeleton className="h-3 w-3 rounded-full" />
								<Skeleton className="h-3 w-24" />
							</div>
						</div>
					))}
				</div>
			</aside>
		);
	}

	if (error) {
		return (
			<aside className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-background border-l border-border p-4">
				<div className="pb-4 border-b">
					<div className="flex items-center gap-2">
						<FaFire className="text-orange-500" />
						<h2 className="font-semibold text-lg">Trending Posts</h2>
					</div>
				</div>
				<div className="flex items-center justify-center h-40">
					<p className="text-sm text-muted-foreground">Error loading trending posts</p>
				</div>
			</aside>
		);
	}

	if (posts.length === 0) {
		return (
			<aside className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-background border-l border-border p-4">
				<div className="pb-4 border-b">
					<div className="flex items-center gap-2">
						<FaFire className="text-orange-500" />
						<h2 className="font-semibold text-lg">Trending Posts</h2>
					</div>
				</div>
				<div className="flex items-center justify-center h-40">
					<p className="text-sm text-muted-foreground">No trending posts found</p>
				</div>
			</aside>
		);
	}

	return (
		<aside className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-background border-l border-border p-4 flex flex-col gap-4 overflow-y-auto">
			<div className="pb-4 border-b">
				<div className="flex items-center gap-2">
					<FaFire className="text-orange-500" />
					<h2 className="font-semibold text-lg">Trending Posts</h2>
				</div>
			</div>

			<div className="space-y-4">
				{posts.map((post) => (
					<Link href={`/post/${post.id}`} key={post.id} className="block">
						<div className="p-3 rounded-lg hover:bg-muted/50 transition-colors bg-gray-bg min-h-28">
							<Badge variant="secondary" className="mb-2 text-xs">
								{post.courseCode}
							</Badge>
							<h3 className="font-medium text-sm line-clamp-2 mb-2">{post.title}</h3>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</aside>
	);
};

export default TrendingPosts;
