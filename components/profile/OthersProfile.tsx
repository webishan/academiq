'use client';

import { useEffect, useState } from 'react';
import { UserProfile } from '@/types/types';
import Image from 'next/image';
import { PostsTab } from './tabs/PostsTab';

export const OthersProfile = ({ userId }: { userId: string }) => {
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

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!profile) {
		return <div>Failed to load profile</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="bg-card rounded-lg shadow-sm p-6 mb-6">
				<div className="flex items-start gap-6">
					<div className="relative h-24 w-24 rounded-full overflow-hidden">
						{profile.image ? (
							<Image src={profile.image} alt={profile.name} fill className="object-cover" />
						) : (
							<div className="w-full h-full bg-primary/10 flex items-center justify-center">
								<span className="text-2xl font-bold text-primary">{profile.name[0]}</span>
							</div>
						)}
					</div>
					<div className="flex-1">
						<h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
						<div className="space-y-1 text-muted-foreground">
							<p>Role: {profile.role}</p>
							{profile.department && <p>Department: {profile.department}</p>}
							{profile.facultyInitials && <p>Faculty Initials: {profile.facultyInitials}</p>}
							{profile.facultyPosition && <p>Position: {profile.facultyPosition}</p>}
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4 mb-6">
				<div className="bg-card rounded-lg shadow-sm p-4">
					<h3 className="font-semibold mb-1">Total Posts</h3>
					<p className="text-2xl font-bold">{profile._count.posts}</p>
				</div>
				<div className="bg-card rounded-lg shadow-sm p-4">
					<h3 className="font-semibold mb-1">Total Comments</h3>
					<p className="text-2xl font-bold">{profile._count.comments}</p>
				</div>
			</div>

			<div className="mt-8">
				<h3 className="text-xl font-semibold mb-4">Posts by {profile.name}</h3>
				<PostsTab userId={userId} />
			</div>
		</div>
	);
};
