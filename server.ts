import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json());

  // Square Payment API endpoint
  app.post('/api/process-square-payment', async (req, res) => {
    try {
      const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || '';
      const SQUARE_LOCATION_ID =
        process.env.SQUARE_LOCATION_ID || process.env.VITE_SQUARE_LOCATION_ID || '';

      if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
        return res.status(500).json({
          success: false,
          error:
            'Configuración incompleta en el servidor: faltan SQUARE_ACCESS_TOKEN o SQUARE_LOCATION_ID.',
        });
      }

      const { sourceId, amount, currency = 'USD', buyerEmail, orderNumber, note } = req.body;

      if (!sourceId) {
        return res.status(400).json({ success: false, error: 'Square source_id (nonce) is required.' });
      }

      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ success: false, error: 'El monto del pago debe ser mayor a cero.' });
      }

      const isSandbox =
        process.env.SQUARE_ENVIRONMENT === 'sandbox' ||
        (process.env.VITE_SQUARE_APPLICATION_ID || '').startsWith('sandbox-');

      const SQUARE_API_URL = isSandbox
        ? 'https://connect.squareupsandbox.com/v2/payments'
        : 'https://connect.squareup.com/v2/payments';

      const amountCents = Math.round(numericAmount * 100);
      const idempotencyKey = 'sq_idemp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);

      const payload = {
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: {
          amount: amountCents,
          currency: currency
        },
        location_id: SQUARE_LOCATION_ID,
        autocomplete: true,
        buyer_email_address: buyerEmail || undefined,
        note: note || `SUNNS Order #${orderNumber || 'Online'}`
      };

      const response = await fetch(SQUARE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Square-Version': '2024-10-17'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Square API Error:', data);
        const firstError = data.errors?.[0];
        let errorMessage = firstError?.detail || 'Error al procesar el pago con Square';
        
        // Translate common decline reasons
        if (firstError?.code === 'INSUFFICIENT_FUNDS') {
          errorMessage = 'Pago rechazado: Fondos insuficientes en la tarjeta.';
        } else if (firstError?.code === 'CARD_DECLINED') {
          errorMessage = 'Pago rechazado: La entidad bancaria ha declinado la transacción.';
        } else if (firstError?.code === 'CVV_FAILURE' || firstError?.code === 'VERIFY_CVV_FAILURE') {
          errorMessage = 'Pago rechazado: El código CVC de seguridad es incorrecto.';
        } else if (firstError?.code === 'CARD_EXPIRED' || firstError?.code === 'INVALID_EXPIRATION') {
          errorMessage = 'Pago rechazado: La tarjeta ingresada ha expirado o su fecha es inválida.';
        } else if (firstError?.code === 'GENERIC_DECLINE') {
          errorMessage = 'Pago rechazado: Transacción denegada por su banco emisor.';
        } else if (firstError?.code === 'CARD_DECLINED_CALL_ISSUER') {
          errorMessage = 'Pago rechazado: Comuníquese con su banco emisor para autorizar el cobro.';
        } else if (firstError?.code === 'ADDRESS_VERIFICATION_FAILURE' || firstError?.code === 'VERIFY_AVS_FAILURE') {
          errorMessage = 'Pago rechazado: La dirección o código postal no coincide con el registro del banco.';
        } else if (firstError?.code === 'UNAUTHORIZED') {
          errorMessage = 'Error de autenticación con Square: verifica tu SQUARE_ACCESS_TOKEN.';
        }

        return res.status(400).json({ success: false, error: errorMessage, code: firstError?.code, details: data.errors });
      }

      return res.json({
        success: true,
        paymentId: data.payment?.id,
        receiptUrl: data.payment?.receipt_url || 'https://squareup.com/receipts',
        status: data.payment?.status,
        cardDetails: {
          brand: data.payment?.card_details?.card?.card_brand || 'CREDIT_CARD',
          last4: data.payment?.card_details?.card?.last4 || '4242'
        }
      });
    } catch (err: any) {
      console.error('Square payment server error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal server error during Square payment' });
    }
  });

  // Vite development middleware or static serving
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
