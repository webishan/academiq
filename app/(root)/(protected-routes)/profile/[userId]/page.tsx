import React from 'react';
import PageWrapper from '@/components/common/PageWrapper';
import { auth } from '@/lib/auth';
import { OwnProfile } from '@/components/profile/OwnProfile';
import { OthersProfile } from '@/components/profile/OthersProfile';
import { redirect } from 'next/navigation';
const ProfilePage = async ({ params }: { params: { userId: string } }) => {
	const session = await auth();
	if (!session?.user) {
		return redirect('/login');
	}
	return (
		<PageWrapper>
			<h1 className="text-3xl font-bold mb-8">{params.userId}</h1>
			{session?.user?.id === params.userId ? <OwnProfile /> : <OthersProfile />}
		</PageWrapper>
	);
};

export default ProfilePage;
