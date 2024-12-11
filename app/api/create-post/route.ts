import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (!session.user.id) {
			return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
		}

		const formData = await req.formData();
		const title = formData.get('title') as string;
		const body = formData.get('body') as string;
		const courseCode = formData.get('courseCode') as string;
		const topics = JSON.parse(formData.get('topics') as string);
		const hasLink = formData.get('hasLink') === 'true';
		const files = formData.getAll('materials') as File[];

		// Upload files to Cloudinary
		const materialUrls = [];
		if (files.length > 0) {
			for (const file of files) {
				const bytes = await file.arrayBuffer();
				const buffer = Buffer.from(bytes);

				// Convert buffer to base64
				const base64Data = buffer.toString('base64');
				const fileType = file.type;
				const dataURI = `data:${fileType};base64,${base64Data}`;

				// Upload to Cloudinary
				const result = await cloudinary.uploader.upload(dataURI, {
					resource_type: 'auto',
					folder: 'academiq',
				});

				materialUrls.push(result.secure_url);
			}
		}

		// Create post in database
		const post = await db.post.create({
			data: {
				title,
				body,
				courseCode,
				topics,
				hasLink,
				materials: materialUrls,
				hasMaterial: materialUrls.length > 0,
				userId: session.user.id,
			},
		});

		return NextResponse.json({ message: 'Post created successfully', post });
	} catch (error) {
		console.error('Error creating post:', error);
		return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
	}
}
