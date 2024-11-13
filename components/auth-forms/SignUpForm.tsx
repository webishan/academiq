'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { useState } from 'react';
import { GoogleLoginButton } from './GoogleLoginButton';
import { CustomToast } from '../common/Toast';
import { useRouter } from 'next/navigation';

const signupUserSchema = z
	.object({
		name: z.string().min(2, {
			message: 'Full Name must be at least 2 characters.',
		}),
		email: z.string().email({
			message: 'Please enter a valid email address.',
		}),
		password: z
			.string()
			.min(6, { message: 'Password must be at least 6 characters long' })
			.regex(/[A-Z]/, {
				message: 'Password must contain at least one uppercase letter',
			})
			.regex(/[a-z]/, {
				message: 'Password must contain at least one lowercase letter',
			})
			.regex(/[0-9]/, { message: 'Password must contain at least one number' })
			.regex(/[\W_]/, {
				message: 'Password must contain at least one special character',
			}),
		confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export const SignUpForm = () => {
	const [isExecuting, setIsExecuting] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof signupUserSchema>>({
		resolver: zodResolver(signupUserSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (values: z.infer<typeof signupUserSchema>) => {
		console.log(values);
		setIsExecuting(true);

		try {
			const res = await fetch('/api/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: values.name,
					email: values.email,
					password: values.password,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				CustomToast.success(data.message);
				router.push('/login');
			} else {
				const errorMessage = data.error || 'An unexpected error occurred';
				CustomToast.error(errorMessage);
			}
		} catch (error: any) {
			CustomToast.error(error.message || 'An unexpected error occurred from frontend catch block');
		} finally {
			setIsExecuting(false);
		}
	};

	const passwordValue = form.watch('password');
	const confirmPasswordValue = form.watch('confirmPassword');
	const passwordChecks = {
		minLength: (passwordValue?.length ?? 0) >= 6,
		hasUppercase: /[A-Z]/.test(passwordValue ?? ''),
		hasLowercase: /[a-z]/.test(passwordValue ?? ''),
		hasNumber: /[0-9]/.test(passwordValue ?? ''),
		hasSpecial: /[\W_]/.test(passwordValue ?? ''),
		passwordsMatch: passwordValue === confirmPasswordValue && passwordValue !== '',
	};
	return (
		<div className="w-[50%]">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="h-[80px]">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter your full name" {...field} type="text" disabled={isExecuting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="h-[80px]">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input type="email" placeholder="Email" {...field} disabled={isExecuting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="h-[80px]">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => <PasswordInput field={field} label="Enter Password" disabled={isExecuting} />}
						/>
					</div>
					<div className="h-[80px]">
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => <PasswordInput field={field} label="Confirm Password" disabled={isExecuting} />}
						/>
					</div>
					<div className="flex flex-row justify-between gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="w-full">
										<Button type="submit" className="w-full" disabled={isExecuting || !form.formState.isDirty || !form.formState.isValid}>
											{isExecuting ? 'Creating account...' : 'Create Account'}
										</Button>
									</div>
								</TooltipTrigger>
								{!form.formState.isValid && form.formState.isDirty && (
									<TooltipContent className="space-y-2">
										<div className="flex items-center gap-2">
											{passwordChecks.minLength ? <Check className="size-4 text-green-500" /> : <X className="size-4 text-destructive" />}
											<span>At least 10 characters</span>
										</div>
										<div className="flex items-center gap-2">
											{passwordChecks.hasUppercase ? <Check className="size-4 text-green-500" /> : <X className="size-4 text-destructive" />}
											<span>One uppercase letter</span>
										</div>
										<div className="flex items-center gap-2">
											{passwordChecks.hasLowercase ? <Check className="size-4 text-green-500" /> : <X className="size-4 text-destructive" />}
											<span>One lowercase letter</span>
										</div>
										<div className="flex items-center gap-2">
											{passwordChecks.hasNumber ? <Check className="size-4 text-green-500" /> : <X className="size-4 text-destructive" />}
											<span>One number</span>
										</div>
										<div className="flex items-center gap-2">
											{passwordChecks.hasSpecial ? <Check className="size-4 text-green-500" /> : <X className="size-4 text-destructive" />}
											<span>One special character</span>
										</div>
										<div className="flex items-center gap-2">
											{passwordChecks.passwordsMatch ? <Check className="size-4 text-green-500" /> : <X className="size-4 text-destructive" />}
											<span>Make sure confirm password matches</span>
										</div>
									</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>
						{/* <GoogleOAuthButton purpose="signup" /> */}
						<GoogleLoginButton />
					</div>
				</form>
			</Form>
		</div>
	);
};
