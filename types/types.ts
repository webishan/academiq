import { Post, User } from '@prisma/client';

export interface PostWithUser extends Post {
	user: Pick<User, 'id' | 'name' | 'image'>;
	_count: {
		comments: number;
		votes: number;
	};
}
