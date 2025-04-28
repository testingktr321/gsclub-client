import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { shipmentUpdateTemplate } from "@/emails/shipmentUpdateTemplate";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (payload.event === "track_updated") {
      const tracking = payload.data;

      const shipment = await prisma.shipment.findFirst({
        where: {
          trackingNumber: tracking.tracking_number,
        },
        include: {
          order: {
            include: {
              Shipment: true,
              user: true,
            },
          },
        },
      });

      const userName = shipment?.order?.user.name;

      if (shipment && shipment.order) {
        const updatedShipment = await prisma.shipment.update({
          where: {
            id: shipment.id,
          },
          data: {
            status: tracking.tracking_status.status.toLowerCase(),
          },
        });

        const significantStatuses = [
          "delivered",
          "in_transit",
          "out_for_delivery",
          "failure",
        ];

        if (
          significantStatuses.includes(updatedShipment.status) &&
          shipment.order.userEmail
        ) {
          const emailSubject = `Shipment Update for Order #${shipment.order.id}`;
          const displayName =
            userName === "Guest User" ? "Valued Customer" : userName;
          const emailHtml = shipmentUpdateTemplate(
            displayName!,
            shipment.order.id,
            tracking.tracking_number,
            updatedShipment.status,
            tracking.tracking_url
          );

          await sendEmail(shipment.order.userEmail, emailSubject, emailHtml);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Shippo Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
