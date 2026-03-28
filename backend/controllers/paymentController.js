const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const Application = require('../models/Application');
const User = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    try {
        const { applicationId } = req.body;

        const application = await Application.findById(applicationId)
            .populate('jobId')
            .populate('seekerId', 'name email');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const amountInPaise = application.jobId.credits * 100;

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_${applicationId}`,
        });

        const transaction = await Transaction.create({
            jobId: application.jobId._id,
            applicationId: application._id,
            posterId: req.user._id,
            seekerId: application.seekerId._id,
            amount: application.jobId.credits,
            razorpayOrderId: order.id,
            status: 'created'
        });

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            seekerName: application.seekerId.name,
            jobTitle: application.jobId.title,
            transactionId: transaction._id
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Failed to create payment order' });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            applicationId,
            transactionId
        } = req.body;

        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.razorpayPaymentId = razorpayPaymentId;
        transaction.status = 'paid';
        await transaction.save();

        await Application.findByIdAndUpdate(applicationId, {
            status: 'completed'
        });

        await User.findByIdAndUpdate(transaction.seekerId, {
            $inc: { credits: transaction.amount }
        });

        res.status(200).json({ message: 'Payment verified and credits transferred!' });

    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ message: 'Payment verification failed' });
    }
};

const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { posterId: req.user._id },
                { seekerId: req.user._id }
            ]
        })
        .populate('jobId', 'title')
        .populate('seekerId', 'name')
        .populate('posterId', 'name')
        .sort({ createdAt: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
};

module.exports = { createOrder, verifyPayment, getMyTransactions };