import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import PageWrapper from '@/components/common/PageWrapper';

export default async function EditProfilePage({ params }: { params: { userId: string } }) {
	const session = await auth();

	if (!session?.user) {
		redirect('/login');
	}

	// Security check: Only allow editing own profile
	if (session.user.id !== params.userId) {
		redirect('/');
	}

	return (
		<PageWrapper>
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
				<EditProfileForm userId={params.userId} />
			</div>
		</PageWrapper>
	);
}
