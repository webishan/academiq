import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: { commentId: string } }) {
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

		await deleteCommentAndChildren(params.commentId);

		return NextResponse.json({ message: 'Comment deleted successfully' });
	} catch (error) {
		console.error('Error deleting comment:', error);
		return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
	}
}

async function deleteCommentAndChildren(commentId: string) {
	const children = await db.comment.findMany({
		where: { parentId: commentId },
		select: { id: true },
	});

	for (const child of children) {
		await deleteCommentAndChildren(child.id);
	}

	await db.report.deleteMany({
		where: { commentId },
	});

	await db.commentVote.deleteMany({
		where: { commentId },
	});

	await db.comment.delete({
		where: { id: commentId },
	});
}
