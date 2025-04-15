import { ER_MESSAGES } from "@/constants/constants";
import { serverError, success, unauthorized } from "@/helpers/response";
import { generateTokens } from "@/helpers/token";
import { UserRepository } from "@/lib/repositories/UserRepository";
import { LoginUserProps, UserProps } from "@/types/props";
import { validateLogin } from "@/validators/validateLogin";
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    const data: LoginUserProps = await req.json();

    const validatorResponse = validateLogin(data);
    if (validatorResponse instanceof Response) return validatorResponse;

    try {
        const { email, password } = data;

        // Find user by email.
        const user = await UserRepository.findByEmail(email);
        if (!user) return unauthorized(ER_MESSAGES.INVALID_CREDENTIALS);

        // Validate password.
        const isMatch = await bcrypt.compare(password, user.CONTRASENA_HASH);
        if (!isMatch) return unauthorized(ER_MESSAGES.INVALID_CREDENTIALS);

        const userProps: UserProps = {
            userId: user.ID_USUARIO,
            email: user.CORREO,
            password: user.CONTRASENA_HASH
        };

        // Create JWT.
        const { token, refreshToken } = generateTokens(userProps);
        return success({ Token: token, RefreshToken: refreshToken });
    }
    catch (error) {
        console.error('Error login endpoint: ', error);
        return serverError();
    }
};