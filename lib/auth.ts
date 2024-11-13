import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { db } from './db';

export const {
	handlers: { GET, POST },
	signIn,
	signOut,
	auth,
} = NextAuth({
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
		}),
		Credentials({
			name: 'Credentials',
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				if (!credentials || !credentials?.email || !credentials?.password) {
					return null;
				}

				const email = credentials.email as string;

				const user: any = await db.user.findUnique({
					where: { email },
				});

				if (user && user.hashedPassword) {
					const isMatch = bcrypt.compareSync(credentials.password as string, user.hashedPassword);
					if (!isMatch) {
						throw new Error('Incorrect password');
					}
				} else {
					throw new Error('User not found');
				}
				return user;
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (token?.sub) {
				const user = await db.user.findUnique({
					where: { id: token.sub },
				});

				if (user) {
					session.user.id = user.id;
					session.user.email = user.email as string;
					// session.user.role = user.roles as string;
					session.user.name = user.name as string;
				}
			}
			return session;
		},
	},
});
