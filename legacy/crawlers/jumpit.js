const axios = require("axios");
const { toStringByFormatting, isInMonths } = require("../utils");

const getUrl = (cateKey, pageNum) =>
	`https://api.jumpit.co.kr/api/positions?page=${pageNum}&jobCategory=${cateKey}&sort=reg_dt&highlight=false`;

const getDetailUrl = id => `https://api.jumpit.co.kr/api/position/${id}`;

const JUMPIT_BASE_URL = "https://www.jumpit.co.kr/position/";

const COUNT_PER_PAGE = 16;

const getPostsFromJumpit = async (position, cateKey, month = undefined) => {
	const result = [];

	let posts = [...Array(COUNT_PER_PAGE)];
	let page = 1;

	while (posts.length === COUNT_PER_PAGE) {
		console.log(`Jumpit - ${position} - page - ${page}`);
		const response = await axios.get(getUrl(cateKey, page));
		const data = response.data;

		if (data.status !== 200) {
			console.error("ERROR");
			continue;
		}
		posts = data.result.positions;

		page += 1;

		const promises = posts.map(async post => {
			const response = await axios.get(getDetailUrl(post.id));
			const data = response.data.result;

			if (month && !isInMonths(data.publishedAt, month)) return;

			const targetData = {
				platform: "점핏",
				companyName: data.companyName ?? "",
				position: position,
				title: data.title ?? "",
				updatedDate: toStringByFormatting(new Date(data.publishedAt)),
				recruitUrl: data.id ? JUMPIT_BASE_URL + data.id : "",
				companyLocation: data.workingPlaces[0]
					? data.workingPlaces[0].address
					: "",
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

module.exports = getPostsFromJumpit;
