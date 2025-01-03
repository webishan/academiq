'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { FaPlus, FaTimes } from 'react-icons/fa';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //docx
];

const createPostSchema = z.object({
	title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
	body: z.string().min(10, { message: 'Body must be at least 10 characters long' }),
	courseCode: z.string().min(1, { message: 'Course code is required' }),
	topics: z
		.string()
		.transform((str) => str.split(',').map((tag) => tag.trim()))
		.transform((tags) => tags.filter((tag): tag is string => tag.length > 0))
		.refine((tags) => tags.every((tag) => !tag.includes(' ')), {
			message: 'Topics should be single words separated by commas (no spaces in topics)',
		}),
	hasLink: z.boolean().default(false),
	materials: z
		.array(z.custom<File>())
		.optional()
		.refine((files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE), 'Max file size is 5MB')
		.refine(
			(files) => !files || files.every((file) => ACCEPTED_FILE_TYPES.includes(file.type)),
			'Only .jpg, .jpeg, .png, .pdf, and .docx files are accepted',
		),
});

export default function CreatePostForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const { toast } = useToast();
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const form = useForm<z.infer<typeof createPostSchema>>({
		resolver: zodResolver(createPostSchema),
		defaultValues: {
			title: '',
			body: '',
			courseCode: '',
			topics: [],
			hasLink: false,
			materials: undefined,
		},
		mode: 'onChange',
	});

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setSelectedFiles((prev) => [...prev, ...files]);
		form.setValue('materials', [...selectedFiles, ...files]);
		e.target.value = '';
	};

	const removeFile = (index: number) => {
		setSelectedFiles((prev) => {
			const newFiles = [...prev];
			newFiles.splice(index, 1);
			form.setValue('materials', newFiles);
			return newFiles;
		});
	};

	const onSubmit = async (values: z.infer<typeof createPostSchema>) => {
		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('title', values.title);
			formData.append('body', values.body);
			formData.append('courseCode', values.courseCode);
			formData.append('topics', JSON.stringify(values.topics));
			formData.append('hasLink', String(values.hasLink));

			if (values.materials) {
				Array.from(values.materials).forEach((file) => {
					formData.append('materials', file);
				});
			}

			const response = await fetch('/api/create-post', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Post created successfully!',
					variant: 'success',
				});
				router.push('/');
			} else {
				toast({
					title: 'Error',
					description: data.error || 'Something went wrong',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create post',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-2xl">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Post title" {...field} />
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
								<Textarea placeholder="Write your post content here..." className="min-h-[200px]" {...field} />
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
								<Input placeholder="e.g., CS101" {...field} />
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

				<FormField
					control={form.control}
					name="hasLink"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>This post contains external links</FormLabel>
							</div>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="materials"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Upload Materials</FormLabel>
							<div className="space-y-4">
								{selectedFiles.length > 0 && (
									<div className="grid gap-2">
										{selectedFiles.map((file, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
												<span className="text-sm truncate">{file.name}</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeFile(index)}
													className="text-destructive hover:text-destructive/90"
												>
													<FaTimes className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								)}
								<div className="flex items-center gap-4">
									<Input type="file" accept=".jpg,.jpeg,.png,.pdf,.docx" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
									<Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()} className="w-full">
										<FaPlus className="mr-2 h-4 w-4" />
										Add {selectedFiles.length > 0 ? 'More ' : ''}Files
									</Button>
								</div>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Creating...' : 'Create Post'}
				</Button>
			</form>
		</Form>
	);
}
