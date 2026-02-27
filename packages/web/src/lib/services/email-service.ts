import { Resend } from 'resend';

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendReminderEmail(to: string, name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://autogoverno.app';

  const resend = getResendClient();
  await resend.emails.send({
    from: 'Diário de Autogoverno <noreply@autogoverno.app>',
    to,
    subject: 'Como foi seu dia na advocacia?',
    html: `
      <div style="background-color: #000000; color: #FFFFFF; font-family: 'Inter', sans-serif; padding: 40px 20px; max-width: 480px; margin: 0 auto;">
        <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600;">
          ${name}, como foi seu dia?
        </h2>
        <p style="color: #9E9E9E; font-size: 14px; line-height: 1.6; margin: 0 0 32px;">
          Registrar situações de pressão é o primeiro passo do autogoverno.
          Leva menos de 5 minutos.
        </p>
        <a href="${appUrl}/entry/new"
           style="display: block; text-align: center; background-color: #E53935; color: #FFFFFF; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Registrar o dia
        </a>
        <p style="color: #757575; font-size: 12px; margin: 32px 0 0; text-align: center;">
          Diário de Autogoverno — Código A.D.V.
        </p>
      </div>
    `,
  });
}
