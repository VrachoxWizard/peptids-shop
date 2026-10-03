import { db } from "../../db";
import { inquiries } from "../../db/schema";
import type { CreateInquiryInput } from "./inquiries.schema";

export class InquiriesService {
  async createInquiry(input: CreateInquiryInput, ipAddress?: string) {
    const [inserted] = await db
      .insert(inquiries)
      .values({
        name: input.name,
        email: input.email,
        message: input.message,
        ipAddress: ipAddress || null,
        status: "NEW",
      })
      .returning();

    return {
      id: inserted.id,
      status: inserted.status,
      createdAt: inserted.createdAt,
    };
  }
}

export const inquiriesService = new InquiriesService();
