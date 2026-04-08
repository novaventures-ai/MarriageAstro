import Razorpay from 'razorpay';
import 'dotenv/config';

async function check() {
  const rzpKeyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
  const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!rzpKeyId || !rzpKeySecret) {
    console.error('Keys missing');
    return;
  }

  const razorpay = new Razorpay({ key_id: rzpKeyId, key_secret: rzpKeySecret });
  
  console.log('Fetching last 10 payments...');
  const payments = await razorpay.payments.all({ count: 10 });
  
  payments.items.forEach(p => {
    console.log(`Payment: ${p.id} | Email: ${p.email} | Status: ${p.status} | Amount: ${p.amount}`);
    console.log('Notes:', JSON.stringify(p.notes, null, 2));
    console.log('---');
  });
}

check();
