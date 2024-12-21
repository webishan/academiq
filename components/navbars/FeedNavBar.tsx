import React from 'react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { FiAlignRight } from 'react-icons/fi';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import LinkButton from '../common/LinkButton';
import CreatePostButton from './CreatePostButton';
import ProfileButton from './ProfileButton';
import SearchBar from './SearchBar';

export const FeedNavbar = async () => {
	const session = await auth();
	return (
		<nav className="w-full bg-background shadow-sm flex flex-row items-center justify-center border-b fixed top-0 left-0 right-0 z-50">
			<div className="container flex flex-row h-16 w-full items-center justify-between px-4 md:px-6">
				<Link href="/" className="flex items-center gap-2" prefetch={false}>
					<span className="font-bold">AcademiQ</span>
				</Link>
				<SearchBar />
				{session?.user ? (
					<div className="hidden gap-2 md:flex items-center justify-center">
						<CreatePostButton />
						<ProfileButton userName={session.user.name || ''} userId={session.user.id || ''} />
					</div>
				) : (
					<div className="hidden gap-2 md:flex">
						<LinkButton href="/login" variant="outline">
							Login
						</LinkButton>

						<LinkButton href="/signup" variant="default">
							Sign up
						</LinkButton>
					</div>
				)}

				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="md:hidden">
							<FiAlignRight />
							<span className="sr-only">Toggle navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right">
						<SheetHeader>
							<SheetTitle>AcademiQ</SheetTitle>
						</SheetHeader>
						{session?.user ? (
							<div className="grid gap-4 p-4">
								<p>{session?.user?.name}</p>
								<p>{session?.user?.email}</p>
								<ProfileButton userName={session.user.name || ''} userId={session.user.id || ''} />
							</div>
						) : (
							<div className="grid gap-4 p-4">
								<LinkButton href="/login" variant="outline">
									Login
								</LinkButton>

								<LinkButton href="/signup" variant="default">
									Sign up
								</LinkButton>
							</div>
						)}
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
};
