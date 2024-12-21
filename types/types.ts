import { Post, User, UserRole } from '@prisma/client';

export interface PostWithUser extends Post {
	user: Pick<User, 'id' | 'name' | 'image'>;
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
