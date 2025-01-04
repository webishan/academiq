import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function POST(request: Request, { params }: { params: { postId: string } }) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = session.user.id;
		const { value } = await request.json();

		const result = await db.$transaction(async (tx) => {
			const existingVote = await tx.postVote.findFirst({
				where: {
					postId: params.postId,
					userId,
				},
			});

			if (existingVote) {
				if (existingVote.value === value) {
					await tx.postVote.delete({
						where: {
							id: existingVote.id,
						},
					});
				} else {
					await tx.postVote.update({
						where: {
							id: existingVote.id,
						},
						data: {
							value,
						},
					});
				}
			} else {
				await tx.postVote.create({
					data: {
						postId: params.postId,
						userId,
						value,
					},
				});
			}

			const upvotes = await tx.postVote.count({
				where: {
					postId: params.postId,
					value: 1,
				},
			});

			const downvotes = await tx.postVote.count({
				where: {
					postId: params.postId,
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

export async function GET(request: Request, { params }: { params: { postId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userVote = await db.postVote.findFirst({
			where: {
				postId: params.postId,
				userId: session.user.id,
			},
		});

		const upvotes = await db.postVote.count({
			where: {
				postId: params.postId,
				value: 1,
			},
		});

		const downvotes = await db.postVote.count({
			where: {
				postId: params.postId,
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
