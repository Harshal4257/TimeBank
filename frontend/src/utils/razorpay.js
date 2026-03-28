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

            // ✅ Enable all payment methods including UPI & QR
            method: {
                upi: true,
                card: true,
                netbanking: true,
                wallet: true,
                qr: true,
            },

            config: {
                display: {
                    blocks: {
                        upi: {
                            name: 'Pay via UPI',
                            instruments: [
                                { method: 'upi', flows: ['qr', 'intent', 'collect'] }
                            ]
                        },
                        card: {
                            name: 'Pay via Card',
                            instruments: [
                                { method: 'card' }
                            ]
                        },
                        netbanking: {
                            name: 'Pay via Netbanking',
                            instruments: [
                                { method: 'netbanking' }
                            ]
                        },
                    },
                    sequence: ['block.upi', 'block.card', 'block.netbanking'],
                    preferences: {
                        show_default_blocks: true
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