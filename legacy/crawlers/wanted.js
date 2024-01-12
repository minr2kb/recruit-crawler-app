const axios = require("axios");

const COUNT_PER_PAGE = 20;

const getUrl = (cateKey, pageNum) =>
	`https://www.wanted.co.kr/api/v4/jobs?country=kr&tag_type_ids=${cateKey}&locations=all&years=-1&limit=${COUNT_PER_PAGE}&offset=${
		COUNT_PER_PAGE * pageNum
	}&job_sort=job.latest_order`;

const getDetailUrl = id => `https://www.wanted.co.kr/api/v4/jobs/${id}`;

const WANTED_BASE_URL = "https://www.wanted.co.kr/wd/";

const getPostsFromWanted = async (position, cateKey) => {
	const result = [];

	let posts = [...Array(COUNT_PER_PAGE)];
	let page = 0;
	let nextUrl = getUrl(position, page);

	while (nextUrl && posts.length === COUNT_PER_PAGE) {
		console.log(`Wanted - ${position} - page - ${page}`);
		const response = await axios.get(getUrl(cateKey, page));
		const data = response.data;

		nextUrl = data.links?.next;
		if (!data.links?.next) {
			break;
		}
		posts = data.data;
		page += 1;

		const promises = posts.map(async post => {
			const response = await axios.get(getDetailUrl(post.id));
			const data = response.data.job;

			const targetData = {
				platform: "원티드",
				companyName: data.company?.name ?? "",
				position: position,
				title: data.position ?? "",
				updatedDate: "",
				recruitUrl: post.id ? WANTED_BASE_URL + post.id : "",
				companyLocation: data.address?.full_location ?? "",
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

module.exports = getPostsFromWanted;
