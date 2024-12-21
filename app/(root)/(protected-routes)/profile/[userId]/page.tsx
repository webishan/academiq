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
			<div className="w-full h-full">
				{session?.user?.id === params.userId ? <OwnProfile userId={params.userId} /> : <OthersProfile userId={params.userId} />}
			</div>
		</PageWrapper>
	);
};

export default ProfilePage;
