const config = {
	month: 3,
	sites: {
		JUMPIT: true,
		PROGRAMMERS: true,
		JOBPLANET: true,
		WANTED: true,
		REMEMBER: true,
	},
	positions: {
		JUMPIT: {
			FE: 2,
			BE: 1,
			// FULLSTACK: 3,
			PM: 12,
		},
		PROGRAMMERS: {
			FE: 4,
			BE: 1,
			// WEB: 25,
			PM: 125,
		},
		JOBPLANET: {
			FE: 11905,
			BE: 11904,
			// WEB: 11604,
			PM: 11602,
		},
		WANTED: {
			FE: 669,
			BE: 872,
			// WEB: 873,
			PM: 559,
		},
    REMEMBER: {
			WEB: "웹 개발",
			APP: "앱 개발",
			PM: "프로젝트 관리",
		},
	},
	headers: {
		platform: "플랫폼",
		companyName: "회사명",
		position: "포지션",
		title: "공고명",
		updatedDate: "업데이트일자",
		recruitUrl: "공고 주소",
		companyLocation: "회사 주소",
	},
};
module.exports = config;
