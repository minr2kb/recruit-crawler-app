const axios = require("axios");
const { toStringByFormatting, isInMonths } = require("../utils");

const getUrl = (cateKey, pageNum) =>
	`https://career.programmers.co.kr/api/job_positions?order=recent&page=${pageNum}&job_category_ids[]=${cateKey}`;

const PROGRAMMERS_BASE_URL = "https://career.programmers.co.kr/job_positions/";

const getPostsFromProgrammers = async (
	position,
	cateKey,
	month = undefined
) => {
	const result = [];

	let totalPages = 1;
	let posts = [];
	let page = 1;

	while (page <= totalPages) {
		console.log(`Programmers - ${position} - page - ${page}`);
		const response = await axios.get(getUrl(cateKey, page));
		const data = response.data;

		posts = data.jobPositions;
		totalPages = data.totalPages;
		page += 1;

		for (const post of posts) {
			if (month && !isInMonths(post.updatedAt, month)) break;
			const targetData = {
				platform: "프로그래머스",
				companyName: post.company?.name ?? "",
				position: position,
				title: post.title ?? "",
				updatedDate: toStringByFormatting(new Date(post.updatedAt)),
				recruitUrl: PROGRAMMERS_BASE_URL + post.id,
				companyLocation: post.address ?? "",
			};

			result.push(targetData);
		}
	}
	return result.sort(
		(a, b) => new Date(b.updatedDate) - new Date(a.updatedDate)
	);
};

module.exports = getPostsFromProgrammers;
