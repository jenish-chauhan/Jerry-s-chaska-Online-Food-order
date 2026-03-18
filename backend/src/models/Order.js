const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: {
        type: String,
        enum: ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

// Generate a readable order number before saving a new order.
orderSchema.pre("save", async function () {
    if (!this.orderNumber) {
        const count = await this.constructor.countDocuments();
        this.orderNumber = `ORD-${1001 + count}`;
    }
});

module.exports = mongoose.model('Order', orderSchema);
