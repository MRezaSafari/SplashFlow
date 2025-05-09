interface UnsplashPhoto {
	id: string;
	slug: string;
	alt_description: string | null;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
		small_s3: string;
	};
	links: {
		html: string;
	};
	likes: number;
	user: {
		username: string;
		name: string;
		profile_image: {
			medium: string;
		};
		links: {
			html: string;
		};
	};
}

interface UnsplashPhotoResponse {
	data: UnsplashPhoto[];
}

export type { UnsplashPhoto, UnsplashPhotoResponse };
