const getPostsFromJumpit = require("./crawlers/jumpit");
const getPostsFromProgrammers = require("./crawlers/programmers");
const getPostsFromJobplanet = require("./crawlers/jobplanet");
const getPostsFromWanted = require("./crawlers/wanted");
const getPostsFromRemember = require("./crawlers/remember");
const { convertAndSaveCSV } = require("./utils");
const config = require("./config");

const MONTH_LIMIT = config.month;
const CRAWLING_LIST = config.sites;
const POSITIONS = config.positions;

const getFunc = siteName => {
	switch (siteName) {
		case "JUMPIT":
			return getPostsFromJumpit;
		case "PROGRAMMERS":
			return getPostsFromProgrammers;
		case "JOBPLANET":
			return getPostsFromJobplanet;
		case "WANTED":
			return getPostsFromWanted;
		case "REMEMBER":
			return getPostsFromRemember;
	}
};

const getPosts = async siteName => {
	const promises = Object.entries(POSITIONS[siteName]).map(
		async ([position, cateKey]) => {
			const data = await getFunc(siteName)(
				position,
				cateKey,
				MONTH_LIMIT
			);
			convertAndSaveCSV(`${siteName}/${siteName}_${position}`, data);
			return data;x
		}
	);

	const results = await Promise.all(promises);
	const fullData = [].concat(...results);
	convertAndSaveCSV(`${siteName}/${siteName}_ALL`, fullData);

	return fullData;
};

const main = async () => {
	try {
		console.time("⏱️ Total time spent");
		console.log("\n\n####### 🚗 Initializing 🚗 #######\n\n");
		const promises = Object.entries(CRAWLING_LIST).map(
			async ([siteName, enabled]) =>
				enabled ? await getPosts(siteName) : undefined
		);

		const results = await Promise.all(promises);
		const fullData = [].concat(...results);
		convertAndSaveCSV(`RECRUITS_ALL`, fullData);
		console.log("\n\n####### ✨ Done ✨ #######\n\n");
		console.timeLog("⏱️ Total time spent");
	} catch (err) {
		console.error("🛑 ERROR OCCURED", err);
	}
};

main();
