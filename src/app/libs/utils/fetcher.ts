const fetcher = async (query: string) => {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
	const res = await fetch(`${baseUrl}/api?per_page=20&query=${query}`);
	return res.json();
};

export default fetcher;
