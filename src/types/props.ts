export interface UserProps {
    userId: number;
    email: string;
    password: string;
}

export type LoginUserProps = Pick<UserProps, 'email' | 'password'>;

export interface RegisterUserProps extends Pick<UserProps, 'email' | 'password'> {
    confirmPassword: string
}

export interface SearchProps {
    filter: string;
}