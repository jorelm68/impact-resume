import { User } from 'firebase/auth';
import { createContext } from 'react';

export type UserContextProps = {
    user: User | null | undefined;
}

export const UserContext = createContext<UserContextProps>({ user: null });