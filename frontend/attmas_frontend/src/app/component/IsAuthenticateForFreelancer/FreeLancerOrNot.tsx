"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/reducers/hooks.redux';
import { selectUserSession, UserSchema } from '@/app/reducers/userReducer';

interface FreeLancerOrNotProps {
    children: ReactNode;
}

const FreeLancerOrNot: React.FC<FreeLancerOrNotProps> = ({ children }) => {
    const router = useRouter();
    const userDetails: UserSchema = useAppSelector(selectUserSession);

    useEffect(() => {
        if (userDetails.userType === 'Freelancer') {
            router.push('/dashboard'); // Redirect to dashboard or any other page
        }
    }, [userDetails, router]);

    if (userDetails.userType === 'Freelancer') {
        return null; // Prevent rendering of the children if userType is freelancer
    }

    return <>{children}</>;
};

export default FreeLancerOrNot;
