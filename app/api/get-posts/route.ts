import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (request: Request) => {
	try {
		const posts = await db.post.findMany({
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
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(posts);
	} catch (error) {
		console.error('Error fetching posts:', error);
		return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
	}
};
