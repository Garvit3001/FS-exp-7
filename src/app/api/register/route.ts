import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validationSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the incoming data against the Zod schema
    const result = registrationSchema.safeParse(body);

    if (!result.success) {
      // Send formatting validation errors
      return NextResponse.json(
        { errors: result.error.issues },
        { status: 400 }
      );
    }

    // Simulate network latency / database operation block
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would normally save the user to a database and hash the password (e.g., bcrypt)
    // For this experiment, we simply simulate success with standard REST conventions.
    
    return NextResponse.json(
      { 
        message: "User registered successfully", 
        user: { 
          username: result.data.username, 
          email: result.data.email 
        } 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
