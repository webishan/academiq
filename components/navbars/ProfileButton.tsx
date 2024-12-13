'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { logout } from '@/actions/auth-actions/authAction';

const ProfileButton = ({ userName }: { userName: string }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="rounded-full" size="icon">
					<FaUser className="h-4 w-4" />
					<span className="sr-only">Open user menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel> {userName}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/profile" className="w-full cursor-pointer flex items-center gap-2">
						<FaUser className="h-4 w-4" />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => logout()} className="cursor-pointer flex items-center gap-2">
					<FiLogOut className="h-4 w-4" />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileButton;
