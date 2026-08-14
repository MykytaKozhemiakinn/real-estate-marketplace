import {SESClient, SendEmailCommand} from "@aws-sdk/client-ses";

const client = new SESClient({
    accessKeyId: process.env.SESSION_ACCESS_KEY_ID,
    secretAccessKey: process.env.SESSION_SECRET_KEY,
    region: process.env.SESSION_REGION,
    apiVersion: process.env.SESSION_VERSION,
});

export const sendWelcomeEmail = async (email) => {
    const params = {
        Source: process.env.EMAIL_FROM,
        ReplyToAddresses: [process.env.EMAIL_TO],
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                    <html lang="en">
                        <h1>Hello there. Nice to see you on ${process.env.APP_NAME}. Thank you for joining!</h1>
                        <div style="margin: 20px auto">
                           <ul>
                                <li>
                                    <a href="${process.env.CLIENT_URL}">Browse properties</a>
                                </li>
                                <li>
                                    <a href="${process.env.CLIENT_URL}/post-ad">Post ad</a>
                                </li>                          
                            </ul>
                         </div>
                    </html>
                    `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `Welcome to ${process.env.APP_NAME}.`,
            }
        }
    };

    const command = new SendEmailCommand(params);

    try {
        return await client.send(command);
    } catch (e) {
        throw e;
    }
}

export const sendTemporaryPasswordEmail = async (email, code) => {
    const params = {
        Source: process.env.EMAIL_FROM,
        ReplyToAddresses: [process.env.EMAIL_TO],
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                    <html lang="en">
                        <h1>Hello there. Temporary password.</h1>
                        <p>We've noticed that you've requested temporary password. Don't share it with anyone. 
                        If it wasn't you who requested the code, reach out support immediately.</p>
                        <p>Your new, temporary password is <span style="color: red;">${code}</span>. Change it after login. </p>
                    </html>
                    `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `Temporary password for ${process.env.APP_NAME}.`,
            }
        }
    };

    const command = new SendEmailCommand(params);

    try {
        return await client.send(command);
    } catch (e) {
        throw e;
    }
}