import { Post, User, UserRole } from '@prisma/client';

export interface PostWithUser extends Post {
	user: {
		id: string;
		name: string;
		image: string | null;
		role: string;
	};
	_count: {
		comments: number;
		votes: number;
	};
}

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	image: string | null;
	role: UserRole;
	department: string | null;
	studentId: string | null;
	facultyInitials: string | null;
	facultyPosition: string | null;
	createdAt: Date;
	_count: {
		posts: number;
		comments: number;
	};
}
