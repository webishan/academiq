'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PostWithUser } from '@/types/types';

interface FormValues {
	title: string;
	body: string;
	courseCode: string;
	topics: string;
}

const editPostSchema = z.object({
	title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
	body: z.string().min(10, { message: 'Body must be at least 10 characters long' }),
	courseCode: z.string().min(1, { message: 'Course code is required' }),
	topics: z.string(),
});

interface EditPostFormProps {
	post: PostWithUser;
}

export function EditPostForm({ post }: EditPostFormProps) {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<FormValues>({
		resolver: zodResolver(editPostSchema),
		defaultValues: {
			title: post.title,
			body: post.body,
			courseCode: post.courseCode,
			topics: post.topics ? post.topics.join(', ') : '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (values: FormValues) => {
		const transformedValues = {
			...values,
			topics: values.topics
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean),
		};
		try {
			const response = await fetch(`/api/get-posts/${post.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(transformedValues),
			});

			if (!response.ok) throw new Error('Failed to update post');

			toast({
				title: 'Success',
				description: 'Post updated successfully',
			});

			router.refresh();
			router.push(`/post/${post.id}`);
		} catch (error) {
			console.error('Error updating post:', error);
			toast({
				title: 'Error',
				description: 'Failed to update post',
				variant: 'destructive',
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="body"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="courseCode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Course Code</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="topics"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Topics</FormLabel>
							<FormControl>
								<Input placeholder="Enter topics separated by commas" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" onClick={() => router.back()}>
						Cancel
					</Button>
					<Button type="submit">Update Post</Button>
				</div>
			</form>
		</Form>
	);
}
