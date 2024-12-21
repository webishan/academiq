import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const user = await db.user.findUnique({
			where: {
				id: params.userId,
			},
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				role: true,
				department: true,
				studentId: true,
				facultyInitials: true,
				facultyPosition: true,
				createdAt: true,
				_count: {
					select: {
						posts: true,
						comments: true,
					},
				},
			},
		});

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
	}
}
