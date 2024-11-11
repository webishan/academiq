'use client';
import { Button } from '../ui/button';
import { FaGoogle } from 'react-icons/fa';
import { oAuthLogin } from '@/actions/auth-actions/authAction';

export const GoogleLoginButton = () => {
	return (
		<Button className="flex flex-row items-center justify-center gap-2 w-full" onClick={() => oAuthLogin('google')}>
			<FaGoogle className="" />
			<span className="">Continue with Google</span>
		</Button>
	);
};
