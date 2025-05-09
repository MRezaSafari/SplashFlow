import type { NextRequest } from "next/server";
import { z } from "zod";
import type { UnsplashPhoto } from "../libs/models/unsplash.models";
import { UnsplashPhotoSchema } from "../libs/models/unsplash.schema";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	const accessKey = process.env.UNSPLASH_ACCESS_KEY;
	const query = request.nextUrl.searchParams.get("query");

	if (!query) {
		return Response.json({ error: "No query" }, { status: 400 });
	}

	try {
		const res = await fetch(
			`https://api.unsplash.com/search/photos?page=1&query=${query}`,
			{ headers: { Authorization: `Client-ID ${accessKey}` } },
		);
		const json = await res.json(); // full Unsplash response
		const raw = (json.results ?? []) as unknown[];

		if (!raw) {
			return Response.json({ error: "No data" }, { status: 404 });
		}

		// Parse & strip extras
		const data: UnsplashPhoto[] = raw.map((item) =>
			UnsplashPhotoSchema.parse(item),
		);

		return Response.json({ data });
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.error("Validation errors:", err.errors);
			return Response.json({ error: "Data shape mismatch" }, { status: 502 });
		}
		console.error(err);
		return Response.json({ error: "Failed to fetch data" }, { status: 500 });
	}
}
