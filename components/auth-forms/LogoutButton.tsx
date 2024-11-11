'use client';
import { logout } from '@/actions/auth-actions/authAction';
import { Button } from '../ui/button';

const LogoutButton = () => {
	return <Button onClick={() => logout()}>Logout</Button>;
};

export default LogoutButton;
