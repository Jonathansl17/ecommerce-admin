import nodemailer from 'nodemailer';

function crearTransporte() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function formatearExpiracion(expiresAt) {
  return new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(expiresAt);
}

function obtenerConfiguracionCorreo() {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from,
  };
}

export async function enviarCorreoRecuperacionPassword({
  email,
  fullName,
  recoveryUrl,
  expiresAt,
}) {
  const config = obtenerConfiguracionCorreo();

  if (!config.host || !config.port || !config.user || !config.pass || !config.from) {
    console.warn('[password-recovery] SMTP no configurado. Enlace generado:', recoveryUrl);
    return;
  }

  const transporte = crearTransporte();
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h2>Recuperacion de contrasena</h2>
      <p>Hola${fullName ? `, ${fullName}` : ''}.</p>
      <p>Recibimos una solicitud para restablecer la contrasena de tu cuenta administrativa.</p>
      <p>
        <a
          href="${recoveryUrl}"
          style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px"
        >
          Restablecer contrasena
        </a>
      </p>
      <p>Este enlace expirara el ${formatearExpiracion(expiresAt)}.</p>
      <p>Si no realizaste esta solicitud, puedes ignorar este correo.</p>
    </div>
  `;

  try {
    await transporte.sendMail({
      from: config.from,
      to: email,
      subject: 'Recuperacion de contrasena',
      html,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }

    console.warn('[password-recovery] No se pudo enviar el correo. Enlace generado:', recoveryUrl, error);
  }
}
