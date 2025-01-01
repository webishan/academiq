import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

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

export async function DELETE(request: Request, { params }: { params: { postId: string } }) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const post = await db.post.findUnique({
			where: { id: params.postId },
		});

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 });
		}

		if (post.userId !== session.user.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Delete associated votes first
		await db.postVote.deleteMany({
			where: { postId: params.postId },
		});

		// Delete associated comments and their votes
		const comments = await db.comment.findMany({
			where: { postId: params.postId },
		});

		for (const comment of comments) {
			await db.commentVote.deleteMany({
				where: { commentId: comment.id },
			});
		}

		await db.comment.deleteMany({
			where: { postId: params.postId },
		});

		// Finally delete the post
		await db.post.delete({
			where: { id: params.postId },
		});

		return NextResponse.json({ message: 'Post deleted successfully' });
	} catch (error) {
		console.error('Error deleting post:', error);
		return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
	}
}

export async function PATCH(request: Request, { params }: { params: { postId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const post = await db.post.findUnique({
			where: { id: params.postId },
		});

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 });
		}

		if (post.userId !== session.user.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		const body = await request.json();
		const { title, body: content, courseCode, topics } = body;

		const updatedPost = await db.post.update({
			where: { id: params.postId },
			data: {
				title,
				body: content,
				courseCode,
				topics,
				updatedAt: new Date(),
			},
		});

		return NextResponse.json(updatedPost);
	} catch (error) {
		console.error('Error updating post:', error);
		return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
	}
}
