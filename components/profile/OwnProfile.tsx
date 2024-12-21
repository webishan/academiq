'use client';

import { useEffect, useState } from 'react';
import { UserProfile } from '@/types/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoTab } from './tabs/InfoTab';
import { PostsTab } from './tabs/PostsTab';
import { SavedTab } from './tabs/SavedTab';

export const OwnProfile = ({ userId }: { userId: string }) => {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch(`/api/users/${userId}`);
				if (!response.ok) {
					throw new Error('Failed to fetch profile');
				}
				const data = await response.json();
				setProfile(data);
			} catch (error) {
				console.error('Error fetching profile:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [userId]);

	if (loading) return <div>Loading...</div>;
	if (!profile) return <div>Failed to load profile</div>;

	return (
		<div className="max-w-4xl mx-auto p-6">
			<Tabs defaultValue="info" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="info">Info</TabsTrigger>
					<TabsTrigger value="posts">My Posts</TabsTrigger>
					<TabsTrigger value="saved">Saved Posts</TabsTrigger>
				</TabsList>

				<TabsContent value="info">
					<InfoTab profile={profile} isOwnProfile={true} />
				</TabsContent>

				<TabsContent value="posts">
					<PostsTab userId={userId} />
				</TabsContent>

				<TabsContent value="saved">
					<SavedTab userId={userId} />
				</TabsContent>
			</Tabs>
		</div>
	);
};
