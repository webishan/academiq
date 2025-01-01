import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReportedItems } from '@/components/admin/ReportedItems';
import { db } from '@/lib/db';

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
		<div className="container mx-auto py-8">
			<h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
			<ReportedItems />
		</div>
	);
};

export default AdminDashboard;
