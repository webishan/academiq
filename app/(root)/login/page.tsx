import { LoginForm } from '@/components/auth-forms/LoginForm';
import Link from 'next/link';

const Login = () => {
	return (
		<div className="flex flex-col min-h-screen items-center justify-center">
			<h1 className="mb-2 text-center text-4xl font-bold text-primary">Login</h1>
			<p className="mb-8 text-center">
				Don't have an account?{' '}
				<Link href="/signup" className="text-primary hover:underline">
					Create Account
				</Link>
			</p>
			<LoginForm />
		</div>
	);
};

export default Login;
