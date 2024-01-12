const axios = require("axios");
const { toStringByFormatting, isInMonths } = require("../utils");

const getUrl = (cateKey, pageNum) =>
	`https://www.jobplanet.co.kr/api/v3/job/postings?order_by=recent&occupation_level2=${cateKey}&page=${pageNum}&page_size=20`;

const getDetailUrl = id =>
	`https://www.jobplanet.co.kr/api/v1/job/postings/${id}`;

const JOBPLANET_BASE_URL =
	"https://www.jobplanet.co.kr/job/search?posting_ids%5B%5D=";

const COUNT_PER_PAGE = 20;

const getPostsFromJobplanet = async (position, cateKey, month = undefined) => {
	const result = [];

	let posts = [...Array(COUNT_PER_PAGE)];
	let page = 1;

	while (posts.length === COUNT_PER_PAGE) {
		console.log(`Jobplanet - ${position} - page - ${page}`);
		const response = await axios.get(getUrl(cateKey, page));
		const data = response.data;

		if (data.code !== 200) {
			console.error("ERROR");
			continue;
		}
		posts = data.data.recruits;
		page += 1;

		const promises = posts.map(async post => {
			const response = await axios.get(getDetailUrl(post.id));
			const data = response.data.data;

			if (month && !isInMonths(post.updated_at, month)) return;

			const targetData = {
				platform: "잡플래닛",
				companyName: data.name ?? "",
				position: position,
				title: data.title ?? "",
				updatedDate: toStringByFormatting(new Date(post.updated_at)),
				recruitUrl: post.id ? JOBPLANET_BASE_URL + post.id : "",
				companyLocation: data.location ?? "",
			};
			return targetData;
		});

		const results = await Promise.all(promises);
		results.forEach(data => {
			if (data) result.push(data);
		});
	}
	return result.sort(
		(a, b) => new Date(b.updatedDate) - new Date(a.updatedDate)
	);
};

module.exports = getPostsFromJobplanet;
