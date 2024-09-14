import dotenv from 'dotenv'

dotenv.config({
    path: `${process.env.NODE_ENV}.env`
})

const config = {
    scryptOptions: {
        N: parseInt(process.env.SCRYPT_N),
        r: parseInt(process.env.SCRYPT_R),
        p: parseInt(process.env.SCRYPT_P),
        dkLen: parseInt(process.env.SCRYPT_DKLEN),
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    port: process.env.PORT,
}

export default config