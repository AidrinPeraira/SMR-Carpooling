/**
 * seed-chats.mjs
 *
 * This script seeds the Chat collection in the communication-service database
 * based on the already-existing Member documents.
 *
 * The Members collection was already seeded via RabbitMQ events (UserSignupEvent,
 * NewBookingEvent, NewTripEvent), so each Member has:
 *   - memberId  : the user's ID
 *   - activeTrips: array of tripIds they are active in
 *
 * The Chat collection is NEW and needs to be seeded to match.
 * For each unique tripId found across all members, we create one Chat document
 * (if it doesn't already exist) and add all members that share that tripId.
 *
 * Run:
 *   node scripts/seed-chats.mjs
 *
 * Requires MONGO_DB_URL to be set in .env (loaded via --env-file or dotenv).
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Load .env manually (no dotenv package dependency needed in a plain script)
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env");

try {
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.warn("⚠️  Could not read .env file, relying on environment variables.");
}

const MONGO_DB_URL = process.env.MONGO_DB_URL;
if (!MONGO_DB_URL) {
  console.error("❌ MONGO_DB_URL is not set. Aborting.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Schemas (mirror the application models exactly)
// ---------------------------------------------------------------------------
const memberSchema = new mongoose.Schema({
  memberId:    { type: String, required: true },
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  activeTrips: { type: [String], default: [] },
  createdAt:   { type: Date, required: true },
  updatedAt:   { type: Date, required: true },
});

const chatSchema = new mongoose.Schema(
  {
    chatId:   { type: String, required: true, unique: true },
    tripId:   { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    members:  { type: [String], default: [] },
  },
  { timestamps: true }
);

const MemberModel = mongoose.model("Member", memberSchema);
const ChatModel   = mongoose.model("Chat", chatSchema);

// ---------------------------------------------------------------------------
// Main seed logic
// ---------------------------------------------------------------------------
async function seed() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_DB_URL);
  console.log("✅ Connected.\n");

  // 1. Read all existing members
  const members = await MemberModel.find({}).lean();
  console.log(`👥 Found ${members.length} existing member(s).`);

  if (members.length === 0) {
    console.log("ℹ️  No members found. Nothing to seed.");
    await mongoose.disconnect();
    return;
  }

  // 2. Build a map: tripId → Set<memberId>
  /** @type {Map<string, Set<string>>} */
  const tripMembersMap = new Map();

  for (const member of members) {
    for (const tripId of member.activeTrips ?? []) {
      if (!tripMembersMap.has(tripId)) {
        tripMembersMap.set(tripId, new Set());
      }
      tripMembersMap.get(tripId).add(member.memberId);
    }
  }

  console.log(`🗺️  Found ${tripMembersMap.size} unique active trip(s) across all members.\n`);

  if (tripMembersMap.size === 0) {
    console.log("ℹ️  No active trips found on any member. No chats to seed.");
    await mongoose.disconnect();
    return;
  }

  // 3. For each tripId, upsert a Chat document
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const [tripId, memberIds] of tripMembersMap.entries()) {
    const membersArray = [...memberIds];
    const existing = await ChatModel.findOne({ tripId }).lean();

    if (!existing) {
      // Create new Chat
      await ChatModel.create({
        chatId:   crypto.randomUUID(),
        tripId,
        isActive: true,
        members:  membersArray,
      });
      console.log(`  ✅ Created chat for tripId: ${tripId} | members: [${membersArray.join(", ")}]`);
      created++;
    } else {
      // Chat already exists — merge in any missing members
      const existingMembers = new Set(existing.members);
      const toAdd = membersArray.filter((id) => !existingMembers.has(id));

      if (toAdd.length > 0) {
        await ChatModel.updateOne(
          { tripId },
          { $addToSet: { members: { $each: toAdd } } }
        );
        console.log(`  🔄 Updated chat for tripId: ${tripId} | added members: [${toAdd.join(", ")}]`);
        updated++;
      } else {
        console.log(`  ⏭️  Skipped tripId: ${tripId} — chat already up to date.`);
        skipped++;
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created : ${created}`);
  console.log(`   Updated : ${updated}`);
  console.log(`   Skipped : ${skipped}`);

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected. Done.");
}

seed().catch((err) => {
  console.error("❌ Seed script failed:", err);
  process.exit(1);
});
