import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const posts = await db.post.findMany({
			where: {
				userId: params.userId,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
						role: true,
					},
				},
				_count: {
					select: {
						comments: true,
						votes: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(posts);
	} catch (error) {
		console.error('Error fetching user posts:', error);
		return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
	}
}
