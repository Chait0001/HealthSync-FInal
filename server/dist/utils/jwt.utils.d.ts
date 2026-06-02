import { JwtPayload } from 'jsonwebtoken';
export declare const signToken: (id: string) => string;
export declare const verifyToken: (token: string) => JwtPayload & {
    id: string;
};
//# sourceMappingURL=jwt.utils.d.ts.map