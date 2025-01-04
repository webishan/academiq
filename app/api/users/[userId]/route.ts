import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

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

		if (session.user.id !== params.userId) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const data = await request.json();

		const updateData: any = {
			name: data.name,
			department: data.department,
			studentId: data.studentId,
			facultyInitials: data.facultyInitials,
			facultyPosition: data.facultyPosition,
		};

		if (data.currentPassword && data.newPassword) {
			const user = await db.user.findUnique({
				where: { id: params.userId },
				select: { hashedPassword: true },
			});

			if (!user?.hashedPassword || !bcrypt.compareSync(data.currentPassword, user.hashedPassword)) {
				return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
			}

			updateData.hashedPassword = bcrypt.hashSync(data.newPassword, 10);
		}

		const updatedUser = await db.user.update({
			where: { id: params.userId },
			data: updateData,
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error('Error updating user:', error);
		return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (session.user.id !== params.userId) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		await db.$transaction([
			db.comment.deleteMany({
				where: { userId: params.userId },
			}),

			db.post.deleteMany({
				where: { userId: params.userId },
			}),

			db.user.delete({
				where: { id: params.userId },
			}),
		]);

		return NextResponse.json({ message: 'Account deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error);
		return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
	}
}
