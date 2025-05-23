import { prisma } from "@/lib/prisma";
import { CartItem } from "@/types/cart";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      token,
      email,
      items,
      shippingName,
      shippingStreetAddress,
      shippingState,
      shippingCity,
      shippingZipCode,
      shippingRateId,
      carrier,
      shippingAmount,
    } = body;

    // Step 0: Validate the request
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing payment token" },
        { status: 400 }
      );
    }

    const securityKey = process.env.NMI_SECURITY_KEY;
    if (!securityKey) {
      console.error("NMI_SECURITY_KEY is not defined in environment variables");
      return NextResponse.json(
        { success: false, message: "Payment processor configuration error" },
        { status: 500 }
      );
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!items || !items.length) {
      console.error("No items provided");
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Step 1: Check if the user exists -- guest ordering
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user doesn't exist, create a new user with only the email
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: "Guest User",
        },
      });
    }

    // Step 2: Fetch detailed product information with relations for snapshot
    console.log("Fetching product details from the database");
    const productsWithDetails = await prisma.product.findMany({
      where: {
        id: { in: items.map((item: CartItem) => item.id) },
      },
      include: {
        brand: true,
        flavor: true,
        Nicotine: true,
        productFlavors: {
          include: {
            flavor: true,
          },
        },
        productPuffs: {
          include: {
            puffs: true,
          },
        },
      },
    });

    if (productsWithDetails.length !== items.length) {
      console.error("Some products not found");
      return NextResponse.json(
        { error: "Some products not found" },
        { status: 404 }
      );
    }

    // Step 3: Calculate the order total based on products and quantities
    let subtotal = 0;
    const orderItemsData = items.map((item: CartItem) => {
      const product = productsWithDetails.find((p) => p.id === item.id);
      if (!product) throw new Error(`Product not found: ${item.id}`);

      // Handle flavor based on attributeId
      let flavorName = null;
      if (item.attributeId) {
        // Find the specific flavor from productFlavors
        const productFlavor = product.productFlavors.find(
          (pf) => pf.flavorId === item.attributeId
        );
        flavorName = productFlavor?.flavor.name || null;
      } else if (product.flavor) {
        // Use the direct flavor relation if no attributeId
        flavorName = product.flavor.name;
      }

      // Calculate price per item considering packCount
      const packCount = product.packCount || 1;
      const itemPrice = product.currentPrice / packCount;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      // Create product snapshot with required fields only
      return {
        quantity: item.quantity,
        productId: product.id,
        purchasePrice: itemPrice, // Store per-item price
        attributeId: item.attributeId || null, // Store the attributeId if exists
        productSnapshot: {
          id: product.id,
          name: product.name,
          currentPrice: itemPrice, // Store per-item price
          originalPrice: product.originalPrice
            ? product.originalPrice / packCount
            : null,
          brandName: product.brand.name,
          flavorName: flavorName,
          nicotineName: product.Nicotine.name,
          // Include puffs data if available
          puffs: product.productPuffs.map((pp) => ({
            name: pp.puffs.name,
            description: pp.puffDesc,
          })),
        },
      };
    });

    // Add shipping cost to calculate final total
    const shippingCost = shippingAmount ? parseFloat(shippingAmount) : 0;
    const finalTotal = subtotal + shippingCost;

    // Step 4: Create order in the database with isPaid = false
    const orderData = {
      userEmail: email,
      shippingName,
      shippingStreetAddress,
      shippingState,
      shippingCity,
      shippingZipCode,
      isPaid: false,
      totalAmount: finalTotal,
      shippingAmount: shippingAmount || null,
      orderItems: {
        create: orderItemsData,
      },
      Shipment: shippingRateId
        ? {
            create: {
              shippoShipmentId: shippingRateId,
              shippoTransactionId: null,
              carrier,
              status: "pending",
            },
          }
        : undefined,
      shippingRateId,
    };

    const order = await prisma.order.create({
      data: orderData,
      include: {
        orderItems: true,
        Shipment: true,
      },
    });

    // Step 5: Prepare the request to NMI Payment API with order ID and calculated amount
    const nmiRequestData: Record<string, string> = {
      security_key: securityKey,
      payment_token: token.toString(),
      amount: finalTotal.toFixed(2), // Format to 2 decimal places
      order_id: order.id,
      shipping: shippingCost.toFixed(2),
      type: "sale",
      // Add billing address information (using shipping address as billing)
      firstname: shippingName.split(" ")[0], // Assuming the first part is the first name
      lastname: shippingName.split(" ").slice(1).join(" "), // Assuming the rest is the last name
      address1: shippingStreetAddress,
      city: shippingCity,
      state: shippingState,
      zip: shippingZipCode,
      country: "US",
    };
    // Make the API request to NMI
    const response = await fetch("https://secure.nmi.com/api/transact.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(nmiRequestData).toString(),
    });

    // NMI returns data in a specific format that needs parsing
    const responseText = await response.text();
    const responseData = parseNmiResponse(responseText);

    if (responseData.response === "1") {
      // Payment was successful - update order to paid
      await prisma.order.update({
        where: { id: order.id },
        data: { isPaid: true },
      });

      return NextResponse.json(
        {
          success: true,
          orderId: order.id,
          transactionId: responseData.transactionid,
          authCode: responseData.authcode,
          message: responseData.responsetext,
          total: finalTotal.toFixed(2),
        },
        { status: 200 }
      );
    } else {
      // Payment failed - keep order in database for reference but mark as failed
      console.error("NMI Error:", responseData);
      return NextResponse.json(
        {
          success: false,
          message: responseData.responsetext || "Payment processing error",
          errorDetails: responseData, // Include full error details for debugging
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing the payment",
      },
      { status: 500 }
    );
  }
}

// Helper function to parse NMI's response format
function parseNmiResponse(responseStr: string) {
  const result: Record<string, string> = {};
  responseStr.split("&").forEach((pair) => {
    const [key, value] = pair.split("=");
    result[key] = value;
  });
  return result;
}
