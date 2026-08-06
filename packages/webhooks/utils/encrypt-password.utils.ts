import * as crypto from "node:crypto";

if (!process.env['HASH_SALT']) {
    throw new Error('HASH_SALT is not set in environment variables');
}

const salt: string = process.env['HASH_SALT'];
const pbkdf2Iterations: number = 1000;
const pbkdf2ByteKeylen: number = 128;
const pbkdf2DigestAlg: string = "sha512";


export function encryptPassword(password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, pbkdf2Iterations, pbkdf2ByteKeylen, pbkdf2DigestAlg, (err, derivedKey) => {
            if (err) {
                resolve(null);
            }
            resolve(derivedKey.toString('hex'));
        });
    });
}