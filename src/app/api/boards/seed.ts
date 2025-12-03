import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

const BOARD_COLLECTION = "boards";

async function seedBoards() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "planit");
  const users = db.collection("users");
  const boards = db.collection(BOARD_COLLECTION);

  const existingUser = await users.findOne({}, { projection: { _id: 1, fName: 1, lName: 1, email: 1 } });

  if (!existingUser) {
    console.log("No users found. Seed a user via register first.");
    return;
  }

  const now = new Date();

  const sampleBoards = [
    {
      ownerId: existingUser._id,
      name: "Marketing Campaign",
      description: "Launch and monitor Q4 campaigns across channels.",
      color: "#3b82f6",
      members: [
        {
          userId: existingUser._id.toString(),
          fName: existingUser.fName,
          lName: existingUser.lName,
          email: existingUser.email,
          role: "owner",
        },
      ],
      lists: [
        {
          id: new ObjectId().toString(),
          title: "To Do",
          cards: [
            {
              id: new ObjectId().toString(),
              title: "Draft campaign brief",
              description: "Outline objectives, KPIs, and budget",
              labels: ["Planning", "High Priority"],
              dueDate: "2025-11-20",
              commentsCount: 3,
              attachmentsCount: 1,
            },
            {
              id: new ObjectId().toString(),
              title: "Source design assets",
              labels: ["Design"],
              dueDate: "2025-11-22",
            },
          ],
        },
        {
          id: new ObjectId().toString(),
          title: "In Progress",
          cards: [
            {
              id: new ObjectId().toString(),
              title: "Coordinate influencer outreach",
              labels: ["Partnerships"],
              dueDate: "2025-11-19",
              commentsCount: 2,
            },
          ],
        },
        {
          id: new ObjectId().toString(),
          title: "Review",
          cards: [
            {
              id: new ObjectId().toString(),
              title: "Finalize ad copy",
              labels: ["Copy"],
              dueDate: "2025-11-18",
            },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      ownerId: existingUser._id,
      name: "Product Roadmap",
      description: "Track feature development for the next release.",
      color: "#a855f7",
      members: [
        {
          userId: existingUser._id.toString(),
          fName: existingUser.fName,
          lName: existingUser.lName,
          email: existingUser.email,
          role: "owner",
        },
      ],
      lists: [
        {
          id: new ObjectId().toString(),
          title: "Backlog",
          cards: [
            {
              id: new ObjectId().toString(),
              title: "Audit navigation IA",
              labels: ["UX"],
            },
          ],
        },
        {
          id: new ObjectId().toString(),
          title: "In Progress",
          cards: [
            {
              id: new ObjectId().toString(),
              title: "Implement auth flows",
              description: "Integrate React Query mutations with API",
              labels: ["Feature", "High Priority"],
              commentsCount: 5,
            },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  await boards.deleteMany({ ownerId: existingUser._id });
  const result = await boards.insertMany(sampleBoards);

  console.log(`Seeded ${result.insertedCount} boards for user ${existingUser.email}`);
}

seedBoards()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });