import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// Get all comments for a post
export async function GET(request: Request, { params }: { params: { postId: string } }) {
	try {
		const comments = await db.comment.findMany({
			where: {
				postId: params.postId,
				parentId: null, // Only get top-level comments
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
						role: true,
						department: true,
						facultyInitials: true,
						facultyPosition: true,
					},
				},
				children: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								image: true,
								role: true,
								department: true,
								facultyInitials: true,
								facultyPosition: true,
							},
						},
						_count: {
							select: {
								votes: true,
							},
						},
					},
				},
				_count: {
					select: {
						votes: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(comments);
	} catch (error) {
		console.error('Error fetching comments:', error);
		return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
	}
}

// Create a new comment
export async function POST(request: Request, { params }: { params: { postId: string } }) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { body, parentId } = await request.json();

		const comment = await db.comment.create({
			data: {
				body,
				postId: params.postId,
				userId: session.user.id,
				parentId: parentId || null,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
						role: true,
						department: true,
						facultyInitials: true,
						facultyPosition: true,
					},
				},
				_count: {
					select: {
						votes: true,
					},
				},
			},
		});

		return NextResponse.json(comment);
	} catch (error) {
		console.error('Error creating comment:', error);
		return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
	}
}
