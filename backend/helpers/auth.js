import {randomBytes, pbkdf2} from 'crypto'

export const encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        const salt = randomBytes(16).toString("hex");
        pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt}:${derivedKey.toString("hex")}`);
        })
    })
}

export const validatePassword = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        const [salt, key] = hashedPassword.split(":");
        pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(key === derivedKey.toString("hex"))
        })
    })
}