import { z } from "zod";

const ProfileImageSchema = z
	.object({
		medium: z.string(),
	})
	.strip();

const UserLinksSchema = z
	.object({
		html: z.string(),
	})
	.strip();

const UserSchema = z
	.object({
		username: z.string(),
		name: z.string(),
		profile_image: ProfileImageSchema,
		links: UserLinksSchema,
	})
	.strip();

const UrlsSchema = z
	.object({
		raw: z.string(),
		full: z.string(),
		regular: z.string(),
		small: z.string(),
		thumb: z.string(),
		small_s3: z.string(),
	})
	.strip();

const LinksSchema = z
	.object({
		html: z.string(),
	})
	.strip();

export const UnsplashPhotoSchema = z
	.object({
		id: z.string(),
		slug: z.string(),
		alt_description: z.string().nullable(),
		urls: UrlsSchema,
		links: LinksSchema,
		likes: z.number(),
		user: UserSchema,
	})
	.strip();

export type UnsplashPhoto = z.infer<typeof UnsplashPhotoSchema>;
