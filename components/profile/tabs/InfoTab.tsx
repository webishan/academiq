'use client';

import Image from 'next/image';
import { UserProfile } from '@/types/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/actions/auth-actions/authAction';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface InfoTabProps {
	profile: UserProfile;
	isOwnProfile?: boolean;
}

export const InfoTab = ({ profile, isOwnProfile }: InfoTabProps) => {
	const router = useRouter();
	const { toast } = useToast();

	const deleteAccount = async (userId: string) => {
		try {
			const response = await fetch(`/api/users/${userId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete account');
			}

			toast({
				title: 'Account deleted',
				description: 'Your account has been successfully deleted.',
				variant: 'success',
			});

			await logout();
			router.push('/login');
		} catch (error) {
			console.error('Error deleting account:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete account',
				variant: 'destructive',
			});
		}
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
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" className="w-full">
										Delete Account
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
										<AlertDialogDescription>This action cannot be undone. This will permanently delete your account.</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => deleteAccount(profile.id)}
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
										>
											Delete Account
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
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
