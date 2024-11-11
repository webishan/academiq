import { Button } from '../ui/button';
import { FaGoogle } from 'react-icons/fa';

export const GoogleLoginButton = () => {
	return (
		<Button className="flex flex-row items-center justify-center gap-2 w-full" onClick={() => console.log('google button clicked')}>
			<FaGoogle className="" />
			<span className="">Continue with Google</span>
		</Button>
	);
};
