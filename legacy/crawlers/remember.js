const axios = require("axios");
const { toStringByFormatting, isInMonths } = require("../utils");

const getUrl = () => `https://career-api.rememberapp.co.kr/job_postings/search`;

const getPostBody = (cateKey, page) => ({
	page,
	sort: "starts_at_desc",
	search: {
		job_category_names: [{ level1: "IT·인터넷", level2: cateKey }],
		organization_type: "without_headhunter",
	},
});

const REMEMBER_BASE_URL = "https://career.rememberapp.co.kr/job/postings/";

const COUNT_PER_PAGE = 20;

const getPostsFromRemember = async (position, cateKey, month = undefined) => {
	const result = [];

	let posts = [...Array(COUNT_PER_PAGE)];
	let totalPages = 1;
	let page = 1;

	while (page <= totalPages) {
		console.log(`Remember - ${position} - page - ${page}`);
		const response = await axios.post(getUrl(), getPostBody(cateKey, page));
		const data = response.data;

		posts = data.data;
		totalPages = data.meta.total_pages;
		page += 1;

		for (const post of posts) {
			if (month && !isInMonths(post.starts_at, month)) break;
			const targetData = {
				platform: "리멤버",
				companyName: post.organization?.name ?? "",
				title: post.title,
				position: position,
				updatedDate: toStringByFormatting(new Date(post.starts_at)),
				recruitUrl: REMEMBER_BASE_URL + post.id,
				companyLocation: post.addresses[0]
					? post.addresses[0].address_level1 +
					  " " +
					  post.addresses[0].address_level2
					: "",
			};

			result.push(targetData);
		}
	}
	return result.sort(
		(a, b) => new Date(b.updatedDate) - new Date(a.updatedDate)
	);
};

module.exports = getPostsFromRemember;
