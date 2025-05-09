interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

const calculateOverlapArea = (rect1: Rect, rect2: Rect): number => {
	const overlapX = Math.max(
		0,
		Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
			Math.max(rect1.x, rect2.x),
	);
	const overlapY = Math.max(
		0,
		Math.min(rect1.y + rect1.height, rect2.y + rect2.height) -
			Math.max(rect1.y, rect2.y),
	);
	return overlapX * overlapY;
};

interface RandomPositionOptions {
	isCenter?: boolean;
	existingRects?: Rect[];
	centerRect?: Rect;
	maxAttempts?: number;
}

const randomPositionInBody = (
	imageWidth: number,
	imageHeight: number,
	options: RandomPositionOptions = {},
): { x: number; y: number } | null => {
	const {
		isCenter = false,
		existingRects = [],
		centerRect = null,
		maxAttempts = 50,
	} = options;

	if (typeof document === "undefined" || !document.body) {
		return null;
	}

	const bodyWidth = document.body.clientWidth;
	const bodyHeight = document.body.clientHeight;

	if (imageWidth <= 0 || imageHeight <= 0) {
		return null;
	}

	if (imageWidth > bodyWidth || imageHeight > bodyHeight) {
		return null;
	}

	if (isCenter) {
		const centerX = (bodyWidth - imageWidth) / 2;
		const centerY = (bodyHeight - imageHeight) / 2;
		return { x: centerX, y: centerY };
	}

	const maxX = bodyWidth - imageWidth;
	const maxY = bodyHeight - imageHeight;

	if (maxAttempts <= 0) {
		return { x: Math.random() * maxX, y: Math.random() * maxY };
	}

	let bestPosition: { x: number; y: number } | null = null;
	let minOverlap = Number.POSITIVE_INFINITY;

	const allRectsToAvoid = [...existingRects];
	if (centerRect) {
		allRectsToAvoid.push(centerRect);
	}

	for (let i = 0; i < maxAttempts; i++) {
		const x = Math.random() * maxX;
		const y = Math.random() * maxY;

		const currentRect: Rect = { x, y, width: imageWidth, height: imageHeight };
		let currentTotalOverlap = 0;

		for (const existing of allRectsToAvoid) {
			currentTotalOverlap += calculateOverlapArea(currentRect, existing);
		}

		if (bestPosition === null || currentTotalOverlap < minOverlap) {
			minOverlap = currentTotalOverlap;
			bestPosition = { x, y };
			if (minOverlap === 0) {
				break;
			}
		}
	}

	return bestPosition;
};

export { randomPositionInBody };
