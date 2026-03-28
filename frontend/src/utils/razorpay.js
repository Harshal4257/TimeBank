import API from '../services/api';

export const initiatePayment = async (applicationId, onSuccess) => {
    try {
        const { data } = await API.post('/payments/create-order', { applicationId });

        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: 'TimeBank',
            description: `Payment for: ${data.jobTitle}`,
            order_id: data.orderId,

            config: {
                display: {
                    blocks: {
                        cards: {
                            name: 'Cards',
                            instruments: [
                                { method: 'card' }
                            ]
                        },
                        netbanking: {
                            name: 'Netbanking',
                            instruments: [
                                { method: 'netbanking' }
                            ]
                        },
                        upi: {
                            name: 'UPI',
                            instruments: [
                                {
                                    method: 'upi',
                                    flows: ['qr', 'collect', 'intent']
                                }
                            ]
                        },
                        wallets: {
                            name: 'Wallet',
                            instruments: [
                                { method: 'wallet' }
                            ]
                        },
                        paylater: {
                            name: 'Pay Later',
                            instruments: [
                                { method: 'paylater' }
                            ]
                        },
                    },
                    // ✅ Exact order you want
                    sequence: [
                        'block.cards',
                        'block.netbanking',
                        'block.upi',
                        'block.wallets',
                        'block.paylater'
                    ],
                    preferences: {
                        show_default_blocks: false // ❌ Hides Recommended, Pay via Card, Pay via Netbanking
                    }
                }
            },

            handler: async function (response) {
                await API.post('/payments/verify', {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    applicationId: applicationId,
                    transactionId: data.transactionId
                });
                alert('Payment successful! Credits transferred to seeker.');
                onSuccess();
            },

            prefill: {
                name: 'TimeBank User',
                email: '',
                contact: ''
            },

            theme: {
                color: '#059669'
            }
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (response) {
            alert('Payment failed: ' + response.error.description);
        });

        rzp.open();

    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
    }
};