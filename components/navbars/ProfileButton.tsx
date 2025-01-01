'use client';
import { Button } from '../ui/button';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import Link from 'next/link';
import { logout } from '@/actions/auth-actions/authAction';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const ProfileButton = ({ userName, userId, image, role }: { userName: string; userId: string; image?: string | null; role?: string }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	console.log();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<Button variant="outline" className="rounded-full" size="icon" onClick={() => setIsOpen(!isOpen)}>
				{image ? <Image src={image} alt="Profile" width={20} height={20} className="rounded-full w-full h-full" /> : <FaUser className="h-4 w-4" />}
				<span className="sr-only">Open user menu</span>
			</Button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover shadow-lg">
					<div className="px-4 py-3 border-b">
						<p className="text-sm font-semibold">{userName}</p>
					</div>

					<div className="py-1">
						<Link
							href={`/profile/${userId}`}
							className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted cursor-pointer"
							onClick={() => setIsOpen(false)}
						>
							<FaUser className="h-4 w-4" />
							Profile
						</Link>

						{role === 'ADMIN' && (
							<Link
								href="/admin-panel/dashboard"
								className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted cursor-pointer"
								onClick={() => setIsOpen(false)}
							>
								<MdDashboard className="h-4 w-4" />
								Admin Dashboard
							</Link>
						)}

						<button
							onClick={() => {
								setIsOpen(false);
								logout();
							}}
							className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted cursor-pointer"
						>
							<FiLogOut className="h-4 w-4" />
							Logout
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfileButton;
