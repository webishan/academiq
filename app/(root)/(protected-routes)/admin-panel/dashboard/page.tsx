import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReportedItems } from '@/components/admin/ReportedItems';
import { db } from '@/lib/db';
import PageWrapper from '@/components/common/PageWrapper';

const AdminDashboard = async () => {
	const session = await auth();
	if (!session?.user) redirect('/login');

	// Check if user is admin
	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: { role: true },
	});

	if (user?.role !== 'ADMIN') redirect('/');

	return (
		<PageWrapper>
			<div className="w-full flex justify-start items-center">
				<h1 className="text-2xl font-bold mb-6 bg-secondary p-4 rounded-lg">Admin Dashboard</h1>
			</div>
			<div className="w-full">
				<ReportedItems />
			</div>
		</PageWrapper>
	);
};

export default AdminDashboard;
