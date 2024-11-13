import { SignUpForm } from '@/components/auth-forms/SignUpForm';
import Link from 'next/link';

const SignUp = () => {
	return (
		<div className="flex flex-col min-h-screen items-center justify-center">
			<h1 className="mb-2 text-center text-4xl font-bold text-primary">Create Account</h1>
			<p className="mb-8 text-center">
				Already have an account?{' '}
				<Link href="/login" className="text-primary hover:underline">
					Log in
				</Link>
			</p>
			<SignUpForm />
		</div>
	);
};

export default SignUp;
