'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '../auth-forms/PasswordInput';
import { useToast } from '@/hooks/use-toast';
const editProfileSchema = z
	.object({
		name: z.string().min(2, {
			message: 'Full Name must be at least 2 characters.',
		}),
		department: z.string().optional(),
		studentId: z.string().optional(),
		facultyInitials: z.string().optional(),
		facultyPosition: z.string().optional(),
		currentPassword: z.string().optional(),
		newPassword: z
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
			})
			.optional(),
		confirmNewPassword: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.currentPassword || data.newPassword || data.confirmNewPassword) {
			if (!data.currentPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Current password is required to change password',
					path: ['currentPassword'],
				});
			}
			if (!data.newPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'New password is required',
					path: ['newPassword'],
				});
			}
			if (!data.confirmNewPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Confirm new password is required',
					path: ['confirmNewPassword'],
				});
			}
			if (data.newPassword !== data.confirmNewPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Passwords do not match',
					path: ['confirmNewPassword'],
				});
			}
		}
	});

export function EditProfileForm({ userId }: { userId: string }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof editProfileSchema>>({
		resolver: zodResolver(editProfileSchema),
		defaultValues: {
			name: '',
			department: '',
			studentId: '',
			facultyInitials: '',
			facultyPosition: '',
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		},
		mode: 'onChange',
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch(`/api/users/${userId}`);
				if (!response.ok) throw new Error('Failed to fetch profile');
				const data = await response.json();
				setProfile(data);
				form.reset({
					name: data.name,
					department: data.department || '',
					studentId: data.studentId || '',
					facultyInitials: data.facultyInitials || '',
					facultyPosition: data.facultyPosition || '',
				});
			} catch (error) {
				console.error('Error:', error);
				toast({
					title: 'Error',
					description: 'Failed to load profile',
					variant: 'destructive',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [userId, form]);

	const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
		try {
			const response = await fetch(`/api/users/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) throw new Error('Failed to update profile');

			toast({
				title: 'Success',
				description: 'Profile updated successfully',
				variant: 'success',
			});
			router.push(`/profile/${userId}`);
			router.refresh();
		} catch (error) {
			console.error('Error:', error);
			toast({
				title: 'Error',
				description: 'Failed to update profile',
				variant: 'destructive',
			});
		}
	};

	if (loading) return <div>Loading...</div>;
	if (!profile) return <div>Failed to load profile</div>;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="department"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Department</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{profile.role === 'STUDENT' && (
					<FormField
						control={form.control}
						name="studentId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Student ID</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{profile.role === 'FACULTY' && (
					<>
						<FormField
							control={form.control}
							name="facultyInitials"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Faculty Initials</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="facultyPosition"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Position</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}

				<div className="border-t pt-6 mt-6">
					<h3 className="text-lg font-semibold mb-4">Change Password</h3>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => <PasswordInput field={field} label="Current Password" />}
						/>

						<FormField control={form.control} name="newPassword" render={({ field }) => <PasswordInput field={field} label="New Password" />} />

						<FormField
							control={form.control}
							name="confirmNewPassword"
							render={({ field }) => <PasswordInput field={field} label="Confirm New Password" />}
						/>
					</div>
				</div>

				<div className="flex gap-4">
					<Button type="submit">Save Changes</Button>
					<Button type="button" variant="outline" onClick={() => router.back()}>
						Cancel
					</Button>
				</div>
			</form>
		</Form>
	);
}
