export const handler = async (event: {
  httpMethod?: string;
  body?: string | null;
}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    };
  }

  try {
    const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || '';
    const SQUARE_LOCATION_ID =
      process.env.SQUARE_LOCATION_ID || process.env.VITE_SQUARE_LOCATION_ID || '';

    if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            'Configuración incompleta en el servidor: faltan SQUARE_ACCESS_TOKEN o SQUARE_LOCATION_ID en Netlify.',
        }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { sourceId, amount, currency = 'USD', buyerEmail, orderNumber, note } = body;

    if (!sourceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'No se recibió el token seguro de la tarjeta (sourceId).',
        }),
      };
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'El monto del pago debe ser mayor a cero.',
        }),
      };
    }

    const isSandbox =
      process.env.SQUARE_ENVIRONMENT === 'sandbox' ||
      (process.env.VITE_SQUARE_APPLICATION_ID || '').startsWith('sandbox-');

    const SQUARE_API_URL = isSandbox
      ? 'https://connect.squareupsandbox.com/v2/payments'
      : 'https://connect.squareup.com/v2/payments';

    const amountCents = Math.round(numericAmount * 100);
    const idempotencyKey =
      'sq_idemp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);

    const payload = {
      source_id: sourceId,
      idempotency_key: idempotencyKey,
      amount_money: {
        amount: amountCents,
        currency,
      },
      location_id: SQUARE_LOCATION_ID,
      autocomplete: true,
      buyer_email_address: buyerEmail || undefined,
      note: note || `SUNNS Order #${orderNumber || 'Online'}`,
    };

    const response = await fetch(SQUARE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2024-10-17',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Square API Error:', data);
      const firstError = data.errors?.[0];
      let errorMessage =
        firstError?.detail || 'Error al procesar el pago con Square.';

      if (firstError?.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Pago rechazado: Fondos insuficientes en la tarjeta.';
      } else if (firstError?.code === 'CARD_DECLINED') {
        errorMessage = 'Pago rechazado: La entidad bancaria ha declinado la transacción.';
      } else if (
        firstError?.code === 'CVV_FAILURE' ||
        firstError?.code === 'VERIFY_CVV_FAILURE'
      ) {
        errorMessage = 'Pago rechazado: El código CVC de seguridad es incorrecto.';
      } else if (firstError?.code === 'CARD_EXPIRED' || firstError?.code === 'INVALID_EXPIRATION') {
        errorMessage = 'Pago rechazado: La tarjeta ingresada ha expirado o su fecha es inválida.';
      } else if (firstError?.code === 'GENERIC_DECLINE') {
        errorMessage = 'Pago rechazado: Transacción denegada por su banco emisor.';
      } else if (firstError?.code === 'CARD_DECLINED_CALL_ISSUER') {
        errorMessage =
          'Pago rechazado: Comuníquese con su banco emisor para autorizar el cobro.';
      } else if (
        firstError?.code === 'ADDRESS_VERIFICATION_FAILURE' ||
        firstError?.code === 'VERIFY_AVS_FAILURE'
      ) {
        errorMessage =
          'Pago rechazado: El código postal o dirección no coincide con el registro del banco.';
      } else if (firstError?.code === 'UNAUTHORIZED') {
        errorMessage =
          'Error de autenticación con Square: verifica tu SQUARE_ACCESS_TOKEN en Netlify.';
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: errorMessage,
          code: firstError?.code,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        paymentId: data.payment?.id,
        receiptUrl: data.payment?.receipt_url || 'https://squareup.com/receipts',
        status: data.payment?.status,
        cardDetails: {
          brand: data.payment?.card_details?.card?.card_brand || 'CREDIT_CARD',
          last4: data.payment?.card_details?.card?.last4 || '4242',
        },
      }),
    };
  } catch (err: any) {
    console.error('Square Netlify function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: err?.message || 'Error interno en la pasarela de pago.',
      }),
    };
  }
};
