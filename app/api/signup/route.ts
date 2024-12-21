import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/actions/auth-actions/authAction';

export const POST = async (req: Request) => {
	const { name, email, password, role, department, studentId, facultyInitials, facultyPosition } = await req.json();
	try {
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return new NextResponse(JSON.stringify({ error: 'User already exists!' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		const hashedPassword = bcrypt.hashSync(password, 10);

		const newUser = await db.user.create({
			data: {
				name,
				email,
				hashedPassword,
				role,
				department,
				studentId: role === 'STUDENT' ? studentId : null,
				facultyInitials: role === 'FACULTY' ? facultyInitials : null,
				facultyPosition: role === 'FACULTY' ? facultyPosition : null,
			},
		});
		return new NextResponse(JSON.stringify({ message: 'Account created! Please login' }), {
			status: 201,
		});
	} catch (error: any) {
		return new NextResponse(JSON.stringify({ message: 'Something went wrong from backend catch block' + error.message }), {
			status: 500,
		});
	}
};
