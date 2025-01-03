import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subDays } from 'date-fns';

export async function GET() {
	try {
		const sevenDaysAgo = subDays(new Date(), 7);

		const trendingPosts = await db.post.findMany({
			where: {
				createdAt: {
					gte: sevenDaysAgo,
				},
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
					},
				},
				votes: true,
				comments: true,
				_count: {
					select: {
						votes: true,
						comments: true,
					},
				},
			},
			orderBy: [
				{
					votes: {
						_count: 'desc',
					},
				},
				{
					comments: {
						_count: 'desc',
					},
				},
			],
			take: 5,
		});

		return NextResponse.json(trendingPosts);
	} catch (error) {
		console.error('Error fetching trending posts:', error);
		return NextResponse.json({ error: 'Failed to fetch trending posts' }, { status: 500 });
	}
}
