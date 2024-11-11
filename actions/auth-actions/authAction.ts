'use server';

import { signIn, signOut } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { AuthError } from 'next-auth';

// helper function to get user by email
export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.user.findUnique({
			where: {
				email,
			},
		});
		return user;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const oAuthLogin = async (provider: string) => {
	await signIn(provider, { redirectTo: '/' });
	revalidatePath('/');
};

export const logout = async () => {
	await signOut({ redirectTo: '/' });
	revalidatePath('/');
};

export const loginWithCredentials = async (formData: FormData) => {
	const rawFormData = {
		email: formData.get('email'),
		password: formData.get('password'),
		redirectTo: '/',
	};

	const existingUser = await getUserByEmail(formData.get('email') as string);
	console.log(existingUser);

	try {
		await signIn('credentials', rawFormData);
	} catch (error: any) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: 'Invalid credentials!' };

				default:
					// console.log(error.type);
					// console.log(error.message);
					return { error: 'Invalid credentials!' };
			}
		}
		throw error;
	}
	revalidatePath('/');
};
