import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const bookmarks = await db.bookmark.findMany({
			where: {
				userId: params.userId,
			},
			include: {
				post: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								image: true,
							},
						},
						_count: {
							select: {
								comments: true,
								votes: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const posts = bookmarks.map((bookmark) => bookmark.post);
		return NextResponse.json(posts);
	} catch (error) {
		console.error('Error fetching bookmarks:', error);
		return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
	}
}
