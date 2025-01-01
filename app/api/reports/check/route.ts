import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { postId, commentId } = await request.json();

		const existingReport = await db.report.findFirst({
			where: {
				userId: session.user.id,
				...(postId ? { postId } : {}),
				...(commentId ? { commentId } : {}),
			},
		});

		return NextResponse.json({ hasReported: !!existingReport });
	} catch (error) {
		console.error('Error checking report:', error);
		return NextResponse.json({ error: 'Failed to check report status' }, { status: 500 });
	}
}
