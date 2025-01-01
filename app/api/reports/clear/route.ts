import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check if user is admin
		const user = await db.user.findUnique({
			where: { id: session.user.id },
			select: { role: true },
		});

		if (user?.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const { postId, commentId } = await request.json();

		if (!postId && !commentId) {
			return NextResponse.json({ error: 'Either postId or commentId is required' }, { status: 400 });
		}

		if (postId) {
			await db.report.deleteMany({
				where: { postId },
			});
		}

		if (commentId) {
			await db.report.deleteMany({
				where: { commentId },
			});
		}

		return NextResponse.json({ message: 'Reports cleared successfully' });
	} catch (error) {
		console.error('Error clearing reports:', error);
		return NextResponse.json({ error: 'Failed to clear reports' }, { status: 500 });
	}
}
