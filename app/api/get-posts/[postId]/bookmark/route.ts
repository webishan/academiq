import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { postId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const existingBookmark = await db.bookmark.findFirst({
			where: {
				postId: params.postId,
				userId: session.user.id,
			},
		});

		if (existingBookmark) {
			await db.bookmark.delete({
				where: {
					id: existingBookmark.id,
				},
			});
			return NextResponse.json({ bookmarked: false });
		}

		await db.bookmark.create({
			data: {
				postId: params.postId,
				userId: session.user.id,
			},
		});

		return NextResponse.json({ bookmarked: true });
	} catch (error) {
		console.error('Error handling bookmark:', error);
		return NextResponse.json({ error: 'Failed to process bookmark' }, { status: 500 });
	}
}

export async function GET(request: Request, { params }: { params: { postId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const bookmark = await db.bookmark.findFirst({
			where: {
				postId: params.postId,
				userId: session.user.id,
			},
		});

		return NextResponse.json({ bookmarked: !!bookmark });
	} catch (error) {
		console.error('Error checking bookmark status:', error);
		return NextResponse.json({ error: 'Failed to check bookmark status' }, { status: 500 });
	}
}
