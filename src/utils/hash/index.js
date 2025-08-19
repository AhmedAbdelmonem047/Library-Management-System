import bcrypt from "bcrypt";

export const compareHash = async ({ plaintext, cipherText } = {}) => {
    return bcrypt.compareSync(plaintext, cipherText);
}

export const hash = async ({ plaintext, SALT_ROUNDS = process.env.SALT_ROUNDS } = {}) => {
    return bcrypt.hashSync(plaintext, Number(SALT_ROUNDS));
} 