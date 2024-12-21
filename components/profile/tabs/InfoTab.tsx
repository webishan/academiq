'use client';

import Image from 'next/image';
import { UserProfile } from '@/types/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface InfoTabProps {
	profile: UserProfile;
	isOwnProfile?: boolean;
}

export const InfoTab = ({ profile, isOwnProfile }: InfoTabProps) => {
	const router = useRouter();

	const deleteAccount = async (userId: string) => {
		// TODO: Ishan: Implement delete account
	};

	return (
		<>
			<div className="bg-card rounded-lg shadow-sm p-6 mb-6">
				<div className="flex items-start justify-between">
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
								<p>{profile.email}</p>
								<p>Role: {profile.role}</p>
								{profile.department && <p>Department: {profile.department}</p>}
								{profile.studentId && <p>Student ID: {profile.studentId}</p>}
								{profile.facultyInitials && <p>Faculty Initials: {profile.facultyInitials}</p>}
								{profile.facultyPosition && <p>Position: {profile.facultyPosition}</p>}
							</div>
						</div>
					</div>
					{isOwnProfile && (
						<div className="flex flex-col items-center gap-2">
							<Button onClick={() => router.push(`/profile/${profile.id}/edit`)} variant="outline" className="w-full">
								Edit Profile
							</Button>
							<Button onClick={() => deleteAccount(profile.id)} variant="destructive" className="w-full">
								Delete Account
							</Button>
						</div>
					)}
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
		</>
	);
};
