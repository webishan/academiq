import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button } from '../ui/button';
import Link from 'next/link';

const CreatePostButton = () => {
	return (
		<Button className="rounded-full" variant={'outline'}>
			<Link href="/create-post">
				<div className="flex flex-row gap-2 items-center justify-center">
					<FaPlus className="" />
					<p className="tracking-wide">Create Post</p>
				</div>
			</Link>
		</Button>
	);
};

export default CreatePostButton;
