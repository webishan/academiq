import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('q');

		const posts = await db.post.findMany({
			where: query
				? {
						OR: [
							{ title: { contains: query, mode: 'insensitive' } },
							{ body: { contains: query, mode: 'insensitive' } },
							{ courseCode: { contains: query, mode: 'insensitive' } },
							{ user: { name: { contains: query, mode: 'insensitive' } } },
						],
					}
				: {},
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
}
