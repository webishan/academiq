import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('q');
		const hasLink = searchParams.get('hasLink') === 'true';
		const hasMaterial = searchParams.get('hasMaterial') === 'true';
		const fromDate = searchParams.get('fromDate');
		const toDate = searchParams.get('toDate');

		const where: any = {};

		if (query) {
			const normalizedQuery = query.trim().toLowerCase();
			where.OR = [
				{ title: { contains: normalizedQuery, mode: 'insensitive' } },
				{ body: { contains: normalizedQuery, mode: 'insensitive' } },
				{ courseCode: { contains: normalizedQuery, mode: 'insensitive' } },
				{ user: { name: { contains: normalizedQuery, mode: 'insensitive' } } },
				{ topics: { has: normalizedQuery } },
			];
		}

		if (hasLink) where.hasLink = true;
		if (hasMaterial) where.hasMaterial = true;

		if (fromDate || toDate) {
			where.createdAt = {};
			if (fromDate) where.createdAt.gte = new Date(fromDate);
			if (toDate) {
				const endDate = new Date(toDate);
				endDate.setHours(23, 59, 59, 999);
				where.createdAt.lte = endDate;
			}
		}

		const posts = await db.post.findMany({
			where,
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
		console.error('Error fetching posts:', error);
		return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
	}
}
