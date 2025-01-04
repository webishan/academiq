import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { postId, commentId, reason } = await request.json();

		if (!postId && !commentId) {
			return NextResponse.json({ error: 'Either postId or commentId is required' }, { status: 400 });
		}

		const report = await db.report.create({
			data: {
				postId: postId || null,
				commentId: commentId || null,
				userId: session.user.id,
				reason,
			},
		});

		return NextResponse.json(report);
	} catch (error) {
		console.error('Error creating report:', error);
		return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
	}
}

export async function GET(request: Request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const user = await db.user.findUnique({
			where: { id: session.user.id },
			select: { role: true },
		});

		if (user?.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const reportedPosts = await db.post.findMany({
			where: {
				reports: {
					some: {},
				},
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
				reports: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								image: true,
							},
						},
					},
				},
				_count: {
					select: {
						comments: true,
						votes: true,
						reports: true,
					},
				},
			},
		});

		const reportedComments = await db.comment.findMany({
			where: {
				reports: {
					some: {},
				},
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
				post: {
					select: {
						id: true,
						title: true,
					},
				},
				reports: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								image: true,
								role: true,
							},
						},
					},
				},
				_count: {
					select: {
						votes: true,
						reports: true,
					},
				},
			},
		});

		return NextResponse.json({ reportedPosts, reportedComments });
	} catch (error) {
		console.error('Error fetching reports:', error);
		return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
	}
}
