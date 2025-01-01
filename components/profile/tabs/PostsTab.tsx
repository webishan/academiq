'use client';

import { useEffect, useState } from 'react';
import { PostWithUser } from '@/types/types';
import PostCard from '@/components/homepage/PostCard';

interface PostsTabProps {
	userId: string;
}

export const PostsTab = ({ userId }: PostsTabProps) => {
	const [posts, setPosts] = useState<PostWithUser[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch(`/api/users/${userId}/posts`);
				if (!response.ok) {
					throw new Error('Failed to fetch posts');
				}
				const data = await response.json();
				setPosts(data);
			} catch (error) {
				console.error('Error fetching posts:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [userId]);

	if (loading) return <div>Loading posts...</div>;

	return (
		<div className="grid gap-4 grid-cols-1">
			{posts.length === 0 ? (
				<p className="text-muted-foreground col-span-full text-center">No posts yet</p>
			) : (
				posts.map((post) => <PostCard key={post.id} post={post} currentUserId={userId} />)
			)}
		</div>
	);
};
