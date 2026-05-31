import nodemailer from 'nodemailer';
import prisma from '../db/prisma.js';
import { SUPPLY_ALERT_TYPES } from './supplyAlert.constants.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const UNIT_LABELS = {
  grams: 'gramos',
  kilograms: 'kilogramos',
  milliliters: 'mililitros',
  liters: 'litros',
  units: 'unidades',
};

export const sendLowStockAlert = async ({
  supplyName,
  currentStock,
  minThreshold,
  unitOfMeasure,
  alertType,
  avgDailySales = 0,
  diasRestantes = null,
}) => {
  const admins = await prisma.adminUser.findMany({
    where: { accountStatus: 'active' },
    select: { email: true },
  });

  if (admins.length === 0) return;

  const unit = UNIT_LABELS[unitOfMeasure] ?? unitOfMeasure;
  const isOutOfStock = alertType === SUPPLY_ALERT_TYPES.OUT_OF_STOCK;

  const subject = isOutOfStock
    ? `[ALERTA] Insumo agotado: ${supplyName}`
    : `[ALERTA] Stock bajo: ${supplyName}`;

  const diasRestantesText =
    diasRestantes !== null ? `${diasRestantes} día${diasRestantes === 1 ? '' : 's'}` : 'Indeterminado';

  const avgDailySalesText =
    avgDailySales > 0
      ? `${avgDailySales.toFixed(2)} ${unit}/día`
      : 'Sin datos de consumo';

  const html = `
    <h2 style="color:${isOutOfStock ? '#dc2626' : '#b45309'}">${subject}</h2>
    <p>El insumo <strong>${supplyName}</strong> requiere atención en el módulo de inventario.</p>
    <table style="border-collapse:collapse;margin-top:12px">
      <tr>
        <td style="padding:4px 12px 4px 0;color:#6b7280">Stock actual:</td>
        <td style="padding:4px 0;font-weight:600">${currentStock} ${unit}</td>
      </tr>
      <tr>
        <td style="padding:4px 12px 4px 0;color:#6b7280">Umbral mínimo:</td>
        <td style="padding:4px 0;font-weight:600">${minThreshold} ${unit}</td>
      </tr>
      <tr>
        <td style="padding:4px 12px 4px 0;color:#6b7280">Consumo promedio (últimos 30 días):</td>
        <td style="padding:4px 0;font-weight:600">${avgDailySalesText}</td>
      </tr>
      <tr>
        <td style="padding:4px 12px 4px 0;color:#6b7280">Días de stock estimados:</td>
        <td style="padding:4px 0;font-weight:600">${diasRestantesText}</td>
      </tr>
    </table>
    <p style="margin-top:16px">Por favor, registre una entrada de insumo a la brevedad.</p>
  `;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await Promise.all(
    admins.map((admin) =>
      transporter.sendMail({ from, to: admin.email, subject, html })
    )
  );
};
