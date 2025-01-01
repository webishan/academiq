import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: { commentId: string } }) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Check if user is admin
		const user = await db.user.findUnique({
			where: { id: session.user.id },
			select: { role: true },
		});

		if (user?.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
		}

		// First, recursively delete all child comments
		await deleteCommentAndChildren(params.commentId);

		return NextResponse.json({ message: 'Comment deleted successfully' });
	} catch (error) {
		console.error('Error deleting comment:', error);
		return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
	}
}

async function deleteCommentAndChildren(commentId: string) {
	// Get all child comments
	const children = await db.comment.findMany({
		where: { parentId: commentId },
		select: { id: true },
	});

	// Recursively delete children
	for (const child of children) {
		await deleteCommentAndChildren(child.id);
	}

	// Delete the reports first
	await db.report.deleteMany({
		where: { commentId },
	});

	// Delete the votes using the correct model name
	await db.commentVote.deleteMany({
		where: { commentId },
	});

	// Finally delete the comment itself
	await db.comment.delete({
		where: { id: commentId },
	});
}
