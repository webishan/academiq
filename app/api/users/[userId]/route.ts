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

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Security check: Only allow updating own profile
		if (session.user.id !== params.userId) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const data = await request.json();

		const updatedUser = await db.user.update({
			where: { id: params.userId },
			data: {
				name: data.name,
				department: data.department,
				facultyInitials: data.facultyInitials,
				facultyPosition: data.facultyPosition,
			},
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error('Error updating user:', error);
		return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
	}
}
