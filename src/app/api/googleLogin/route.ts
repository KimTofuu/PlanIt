import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: "No credential provided" }, { status: 400 });
    }

    // Verify Google token
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );
    const googleUser = await response.json();

    if (!googleUser.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "planit");
    const users = db.collection("users");

    // Check if user exists
    let user = await users.findOne({ email: googleUser.email });

    // If user doesn't exist, create one
    if (!user) {
      const result = await users.insertOne({
        fName: googleUser.given_name || "",
        lName: googleUser.family_name || "",
        email: googleUser.email,
        googleId: googleUser.sub,
        picture: googleUser.picture,
        createdAt: new Date(),
      });

      user = {
        _id: result.insertedId,
        fName: googleUser.given_name || "",
        lName: googleUser.family_name || "",
        email: googleUser.email,
        googleId: googleUser.sub,
        picture: googleUser.picture,
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || "fallback-secret-change-in-production",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (err: any) {
    console.error("Google login error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}