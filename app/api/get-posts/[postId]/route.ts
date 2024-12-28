import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { postId: string } }) {
	try {
		const post = await db.post.findUnique({
			where: {
				id: params.postId,
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
						comments: true,
						votes: true,
					},
				},
			},
		});

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 });
		}

		return NextResponse.json(post);
	} catch (error) {
		console.error('Error fetching post:', error);
		return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
	}
}
