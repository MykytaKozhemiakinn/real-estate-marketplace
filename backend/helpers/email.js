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