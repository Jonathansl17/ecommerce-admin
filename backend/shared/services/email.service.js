import nodemailer from 'nodemailer';
import prisma from '../db/prisma.js';
import { SUPPLY_ALERT_TYPES } from './supplyAlert.constants.js';
import { EMAIL_CONFIG, EMAIL_SUBJECTS, EMAIL_BODY } from './email.constants.js';
import { UNIT_OF_MEASURE_LABELS } from '../../features/inventory/inventory.constants.js';

const escHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || EMAIL_CONFIG.DEFAULT_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const EMAIL_COLOR = {
  OUT_OF_STOCK: '#dc2626',
  LOW_STOCK: '#b45309',
  TABLE_LABEL: '#6b7280',
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

  const unit = UNIT_OF_MEASURE_LABELS[unitOfMeasure] ?? unitOfMeasure;
  const isOutOfStock = alertType === SUPPLY_ALERT_TYPES.OUT_OF_STOCK;
  const safeSupplyName = escHtml(supplyName);

  const subject = isOutOfStock
    ? EMAIL_SUBJECTS.OUT_OF_STOCK_ALERT(safeSupplyName)
    : EMAIL_SUBJECTS.LOW_STOCK_ALERT(safeSupplyName);

  const diasRestantesText =
    diasRestantes !== null
      ? EMAIL_BODY.LOW_STOCK.DAYS_REMAINING(diasRestantes)
      : EMAIL_BODY.LOW_STOCK.INDETERMINATE;

  const avgDailySalesText =
    avgDailySales > 0
      ? EMAIL_BODY.LOW_STOCK.UNIT_PER_DAY(avgDailySales.toFixed(2), unit)
      : EMAIL_BODY.LOW_STOCK.NO_DATA;

  const color = isOutOfStock ? EMAIL_COLOR.OUT_OF_STOCK : EMAIL_COLOR.LOW_STOCK;

  const html = `
    <h2 style="color:${color}">${safeSupplyName}</h2>
    <p>${EMAIL_BODY.LOW_STOCK.INTRO(safeSupplyName)}</p>
    <table style="border-collapse:collapse;margin-top:12px">
      <tr>
        <td style="padding:4px 12px 4px 0;color:${EMAIL_COLOR.TABLE_LABEL}">${EMAIL_BODY.LOW_STOCK.LABEL_STOCK}</td>
        <td style="padding:4px 0;font-weight:600">${currentStock} ${unit}</td>
      </tr>
      <tr>
        <td style="padding:4px 12px 4px 0;color:${EMAIL_COLOR.TABLE_LABEL}">${EMAIL_BODY.LOW_STOCK.LABEL_THRESHOLD}</td>
        <td style="padding:4px 0;font-weight:600">${minThreshold} ${unit}</td>
      </tr>
      <tr>
        <td style="padding:4px 12px 4px 0;color:${EMAIL_COLOR.TABLE_LABEL}">${EMAIL_BODY.LOW_STOCK.LABEL_AVG}</td>
        <td style="padding:4px 0;font-weight:600">${avgDailySalesText}</td>
      </tr>
      <tr>
        <td style="padding:4px 12px 4px 0;color:${EMAIL_COLOR.TABLE_LABEL}">${EMAIL_BODY.LOW_STOCK.LABEL_DAYS}</td>
        <td style="padding:4px 0;font-weight:600">${diasRestantesText}</td>
      </tr>
    </table>
    <p style="margin-top:16px">${EMAIL_BODY.LOW_STOCK.FOOTER}</p>
  `;

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await Promise.all(
    admins.map((admin) =>
      transporter.sendMail({ from, to: admin.email, subject, html })
    )
  );
};

export const sendReviewRejectedEmail = async ({ customerEmail, customerName, productName }) => {
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) return;

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const safeName = customerName ? escHtml(customerName) : null;
  const safeProduct = escHtml(productName);
  const body = EMAIL_BODY.REVIEW_REJECTED;

  const html = `
    <p>${body.GREETING(safeName)}</p>
    <p>${body.PRODUCT_LINE(safeProduct)}</p>
    <p>${body.REJECTION_REASON}</p>
    <p>${body.CONTACT_LINE}</p>
  `;

  await transporter.sendMail({
    from,
    to: customerEmail,
    subject: EMAIL_SUBJECTS.REVIEW_REJECTED,
    html,
  });
};
