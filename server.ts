import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json());

  const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || 'EAAAIzTZuUdAnM27rs0frhSA5DHQ8JQY39oKU3s-LTuUVWtETDzWVq6YDEwaDQMep';
  const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || 'LY4YAECWHR432';
  const SQUARE_API_URL = 'https://connect.squareup.com/v2/payments';

  // Square Payment API endpoint
  app.post('/api/process-square-payment', async (req, res) => {
    try {
      const { sourceId, amount, currency = 'USD', buyerEmail, orderNumber, note } = req.body;

      if (!sourceId) {
        return res.status(400).json({ success: false, error: 'Square source_id (nonce) is required.' });
      }

      const amountCents = Math.round((amount || 10) * 100);
      const idempotencyKey = 'sq_idemp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

      const payload = {
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: {
          amount: amountCents,
          currency: currency
        },
        location_id: SQUARE_LOCATION_ID,
        autocomplete: true,
        buyer_email_address: buyerEmail || 'customer@sunnsshop.com',
        note: note || `SUNNS Order #${orderNumber || 'Online'}`
      };

      console.log('Processing Square payment for amount:', amountCents, 'at location:', SQUARE_LOCATION_ID);

      const response = await fetch(SQUARE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Square-Version': '2024-01-18'
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
        } else if (firstError?.code === 'CVV_FAILURE') {
          errorMessage = 'Pago rechazado: El código CVC de seguridad es incorrecto.';
        } else if (firstError?.code === 'CARD_EXPIRED') {
          errorMessage = 'Pago rechazado: La tarjeta ingresada ha expirado.';
        } else if (firstError?.code === 'GENERIC_DECLINE') {
          errorMessage = 'Pago rechazado: Transacción denegada por su banco emisor.';
        } else if (firstError?.code === 'CARD_DECLINED_CALL_ISSUER') {
          errorMessage = 'Pago rechazado: Comuníquese con su banco emisor para autorizar el cobro.';
        } else if (firstError?.code === 'ADDRESS_VERIFICATION_FAILURE') {
          errorMessage = 'Pago rechazado: La dirección o código postal no coincide con el registro del banco.';
        }

        return res.status(400).json({ success: false, error: errorMessage, code: firstError?.code, details: data.errors });
      }

      console.log('Square payment successful:', data.payment?.id);
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
