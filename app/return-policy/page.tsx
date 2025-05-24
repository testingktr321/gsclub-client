import React from 'react'

const ReturnsRefunds = () => {
    return (
        <div className="w-11/12 lg:w-10/12 mx-auto px-4 py-8 font-unbounded">
            <h1 className="text-3xl font-semibold mb-6">Returns & Refunds Policy</h1>

            <section className="mb-8">
                <p className="mb-4">
                    If you encounter any issues with your purchase from our website, feel free to contact us via email or website contact form. Our team will assist you through the process. All returns must be initiated within 30 days of the purchase date.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Refunds</h2>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Once we receive and check your returned devices, we will process a refund to the original payment method, deducting a 15% restocking and processing fee.</li>
                    <li>Please note, we do not provide pre-paid return labels, nor do we refund shipping costs.</li>
                    <li>To ensure safe delivery, we recommend adding insurance to your return shipment.</li>
                </ul>
                <p className="mb-4">
                    For orders that have not been shipped but are requested to be canceled and refunded, we retain a 15% cancellation fee. Alternatively, we can issue a store credit for the full amount, in which case no cancellation fee will be applied.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
                <p className="mb-4">
                    Exchanges are available within 30 days of the original purchase date.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Restrictions on Refunds/Exchanges</h2>
                <p className="mb-4 font-medium">Due to FDA regulations, some items are ineligible for return or exchange:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Opened or used e-liquids</li>
                    <li>Products not purchased from www.itips.co</li>
                    <li>Opened or used devices/accessories</li>
                </ul>
                <p className="mb-4 font-medium">We also do not refund:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Shipping costs</li>
                    <li>Sample packs or bundle deals that are partially returned or opened</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Shipping Fees</h2>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Customers are responsible for covering the cost of shipping items back to us.</li>
                    <li>When returned items are received, a customer service representative will contact you to finalize the exchange.</li>
                    <li>You may need to pay the price difference if exchanging for an item of higher value.</li>
                    <li>Standard shipping fees apply to orders under $79.99.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="mb-4">
                    If you have any questions or concerns about this Returns & Refunds Policy, please contact us at <a href="mailto:info@itips.com" className="text-blue-600 hover:underline">info@itips.com</a>.
                </p>
            </section>
        </div>
    )
}

export default ReturnsRefunds