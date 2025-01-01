import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EditPostForm } from '@/components/forms/EditPostForm';
import PageWrapper from '@/components/common/PageWrapper';

export default async function EditPostPage({ params }: { params: { postId: string } }) {
	const session = await auth();
	if (!session?.user) redirect('/login');

	const post = await db.post.findUnique({
		where: { id: params.postId },
		include: {
			user: true,
		},
	});

	if (!post) redirect('/404');
	if (post.userId !== session.user.id) redirect('/');

	return (
		<PageWrapper>
			<div className="w-[50%] flex flex-col justify-center items-center">
				<h1 className="text-2xl font-bold">Edit Post</h1>
				<EditPostForm post={post} />
			</div>
		</PageWrapper>
	);
}
