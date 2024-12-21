'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomToast } from '../common/Toast';

export function EditProfileForm({ userId }: { userId: string }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState<UserProfile | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch(`/api/users/${userId}`);
				if (!response.ok) throw new Error('Failed to fetch profile');
				const data = await response.json();
				setProfile(data);
			} catch (error) {
				console.error('Error:', error);
				CustomToast.error('Failed to load profile');
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [userId]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		try {
			const response = await fetch(`/api/users/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.get('name'),
					department: formData.get('department'),
					facultyInitials: formData.get('facultyInitials'),
					facultyPosition: formData.get('facultyPosition'),
				}),
			});

			if (!response.ok) throw new Error('Failed to update profile');

			CustomToast.success('Profile updated successfully');
			router.push(`/profile/${userId}`);
			router.refresh();
		} catch (error) {
			console.error('Error:', error);
			CustomToast.error('Failed to update profile');
		}
	};

	if (loading) return <div>Loading...</div>;
	if (!profile) return <div>Failed to load profile</div>;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="name">Name</Label>
				<Input id="name" name="name" defaultValue={profile.name} required />
			</div>

			<div className="space-y-2">
				<Label htmlFor="department">Department</Label>
				<Input id="department" name="department" defaultValue={profile.department || ''} />
			</div>

			{profile.role === 'FACULTY' && (
				<>
					<div className="space-y-2">
						<Label htmlFor="facultyInitials">Faculty Initials</Label>
						<Input id="facultyInitials" name="facultyInitials" defaultValue={profile.facultyInitials || ''} />
					</div>

					<div className="space-y-2">
						<Label htmlFor="facultyPosition">Position</Label>
						<Input id="facultyPosition" name="facultyPosition" defaultValue={profile.facultyPosition || ''} />
					</div>
				</>
			)}

			<div className="flex gap-4">
				<Button type="submit">Save Changes</Button>
				<Button type="button" variant="outline" onClick={() => router.back()}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
