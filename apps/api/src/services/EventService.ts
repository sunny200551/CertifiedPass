import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

export class EventService {
  static async createEvent(
    issuerId: string,
    data: {
      name: string;
      eventType: string;
      description?: string;
      date?: string;
      location?: string;
    }
  ) {
    const event = await prisma.issuerEvent.create({
      data: {
        issuerId,
        name: data.name,
        eventType: data.eventType,
        description: data.description ?? null,
        date: data.date ? new Date(data.date) : null,
        location: data.location ?? null,
        isActive: true,
      },
    });

    logger.info(`Event created: ${event.id} by issuer ${issuerId}`);
    return event;
  }

  static async getEvent(id: string, issuerId?: string) {
    const event = await prisma.issuerEvent.findUnique({
      where: { id },
      include: {
        issuer: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            verificationStatus: true,
            logoUrl: true,
          },
        },
        _count: {
          select: {
            credentials: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error("Event not found.");
    }

    if (issuerId && event.issuerId !== issuerId) {
      throw new Error("Unauthorized to access this event.");
    }

    return event;
  }

  static async listEvents(issuerId: string) {
    return prisma.issuerEvent.findMany({
      where: { issuerId, isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            credentials: true,
          },
        },
      },
    });
  }
}
