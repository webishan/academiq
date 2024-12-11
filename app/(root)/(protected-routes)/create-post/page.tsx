import PageWrapper from '@/components/common/PageWrapper';
import CreatePostForm from '@/components/create-post/CreatePostForm';
const CreatePostPage = () => {
	return (
		<PageWrapper>
			<div className="flex flex-row h-full w-full gap-4 items-center justify-center flex-grow">
				<CreatePostForm />
			</div>
		</PageWrapper>
	);
};

export default CreatePostPage;
