import React from 'react'

const PactAndShipping = () => {
    return (
        <div className="w-11/12 lg:w-10/12 mx-auto px-4 py-8 font-unbounded">
            <h1 className="text-3xl font-semibold mb-6">PACT Act & Shipping Policy</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">PACT Act Compliance</h2>
                <p className="mb-4">
                    We ship products through regional carriers, with age verification required before checkout. All unverified orders will need an adult signature upon receipt.
                </p>
                <p className="mb-4">
                    The Prevent All Cigarette Trafficking (PACT) Act, also known as the &quot;vape mail ban,&quot; was enacted in December 2020. This law expands the definition of tobacco products to include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Nicotine e-liquids</li>
                    <li>Nicotine-free e-liquids</li>
                    <li>Electronic cigarette devices</li>
                    <li>Related components</li>
                </ul>
                <p className="mb-4 font-medium">The PACT Act imposes the following requirements on all online retailers:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Verify the age of customers using a commercially available database</li>
                    <li>Register with the ATF and the U.S. Attorney General</li>
                    <li>Register with state and local tax authorities in every jurisdiction where business is conducted</li>
                    <li>Collect and remit all applicable state and local taxes, and apply any necessary tax stamps to products sold</li>
                    <li>Submit a monthly report of all transactions to the tax authorities in each state</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Delivery Times & Process</h2>
                <p className="mb-4">
                    GETSMOKE is dedicated to providing our customers with reliable and timely shipping services.
                </p>
                <p className="mb-4 font-medium">Expected Shipping Times:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Standard Shipping - 5-6 business days</li>
                    <li>Fast Shipping - 2-3 business days</li>
                </ul>
                <p className="mb-4">
                    When you order with us, we provide tracking information that is sent to your email address to ensure your package is on the right route. However, if it appears that your shipment has been delayed past our expected shipping times please let us know and we&apos;ll investigate any issues surrounding the delivery of your purchase.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Age Verification</h2>
                <p className="mb-4">
                    To comply with state laws we require age verification before purchasing any products on this site. Age verification is requested through our company&apos;s email <a href="mailto:info@itips.com" className="text-blue-600 hover:underline">info@itips.com</a>, a secure online age verification way.
                </p>
                <p className="mb-4 font-medium">
                    Please, make sure that you only receive the verification request only through our official contact Information: <a href="mailto:info@itips.com" className="text-blue-600 hover:underline">info@itips.com</a>
                </p>
                <p className="mb-4">
                    Do not provide your age verification document to anyone else.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Route Shipping Protection</h2>
                <p className="mb-4">
                    We&apos;ve partnered with SHIPPO - a package protection and tracking solution - to give our customers the best possible delivery experience.
                </p>
                <p className="mb-4">
                    SHIPPO provides low-cost shipping protection to protect your package in the event that it gets lost, stolen, or damaged while in transit. If you experienced an issue with your order, please file a claim with shippo&apos;s team.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
                <p className="mb-4">
                    Tracking information will be sent directly to your email when your order has been processed by our shipping team.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Canceling Orders</h2>
                <p className="mb-4">
                    If you need to cancel an order right after it has been placed, contact us immediately. We will do our best to cancel and refund your order.
                </p>
                <p className="mb-4">
                    However, once an order has been placed, we cannot guarantee that it can be altered, changed, or canceled upon your request.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="mb-4">
                    If you have any questions or concerns about this shipping policies or PACT Act compliance, please contact us at <a href="mailto:info@itips.com" className="text-blue-600 hover:underline">info@itips.com</a>.
                </p>
            </section>
        </div>
    )
}

export default PactAndShipping