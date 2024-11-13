'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from './PasswordInput';
import { useState } from 'react';
import { GoogleLoginButton } from './GoogleLoginButton';
import { CustomToast } from '../common/Toast';
import { loginWithCredentials } from '@/actions/auth-actions/authAction';
import { useRouter } from 'next/navigation';

const loginUserSchema = z.object({
	email: z.string().email({ message: 'Email is invalid' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const LoginForm = () => {
	const [isExecuting, setIsExecuting] = useState(false);
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(loginUserSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onChange',
	});

	// 2. Define a submit handler.
	const onSubmit = async (values: z.infer<typeof loginUserSchema>) => {
		setIsExecuting(true);

		try {
			const formData = new FormData();
			formData.append('email', values.email);
			formData.append('password', values.password);

			const result = await loginWithCredentials(formData);

			if (result?.error) {
				CustomToast.error(result.error);
				return;
			} else {
				CustomToast.success('Logged in successfully');
				router.push('/');
			}
		} catch (error: any) {
			CustomToast.error(error.message || 'An unexpected error occurred from frontend catch block');
		} finally {
			setIsExecuting(false);
		}
	};
	return (
		<div className="w-[50%]">
			<Form {...form}>
				<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="h-[65px]">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input type="email" placeholder="Enter your email" {...field} disabled={isExecuting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="h-[65px]">
						<FormField control={form.control} name="password" render={({ field }) => <PasswordInput field={field} disabled={isExecuting} />} />
					</div>
					<div className="flex flex-row justify-between gap-2">
						<Button type="submit" className="w-full" disabled={isExecuting || !form.formState.isValid}>
							{isExecuting ? 'Logging in...' : 'Log In'}
						</Button>
						<GoogleLoginButton />
					</div>
				</form>
			</Form>
		</div>
	);
};
