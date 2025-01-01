import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { commentId: string } }) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = session.user.id;
		const { value } = await request.json();

		const result = await db.$transaction(async (tx) => {
			const existingVote = await tx.commentVote.findFirst({
				where: {
					commentId: params.commentId,
					userId,
				},
			});

			if (existingVote) {
				if (existingVote.value === value) {
					await tx.commentVote.delete({
						where: {
							id: existingVote.id,
						},
					});
				} else {
					await tx.commentVote.update({
						where: {
							id: existingVote.id,
						},
						data: {
							value,
						},
					});
				}
			} else {
				await tx.commentVote.create({
					data: {
						commentId: params.commentId,
						userId,
						value,
					},
				});
			}

			const upvotes = await tx.commentVote.count({
				where: {
					commentId: params.commentId,
					value: 1,
				},
			});

			const downvotes = await tx.commentVote.count({
				where: {
					commentId: params.commentId,
					value: -1,
				},
			});

			return { upvotes, downvotes };
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Error handling vote:', error);
		return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
	}
}

export async function GET(request: Request, { params }: { params: { commentId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userVote = await db.commentVote.findFirst({
			where: {
				commentId: params.commentId,
				userId: session.user.id,
			},
		});

		const upvotes = await db.commentVote.count({
			where: {
				commentId: params.commentId,
				value: 1,
			},
		});

		const downvotes = await db.commentVote.count({
			where: {
				commentId: params.commentId,
				value: -1,
			},
		});

		return NextResponse.json({
			userVote: userVote?.value || 0,
			upvotes,
			downvotes,
		});
	} catch (error) {
		console.error('Error fetching votes:', error);
		return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
	}
}
