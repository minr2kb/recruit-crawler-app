const path = require("path");
const fs = require("fs");
const config = require("./config");

function leftPad(value) {
	if (value >= 10) {
		return value;
	}

	return `0${value}`;
}

function toStringByFormatting(source, delimiter = "-") {
	const year = source.getFullYear();
	const month = leftPad(source.getMonth() + 1);
	const day = leftPad(source.getDate());

	return [year, month, day].join(delimiter);
}

function isInMonths(someDate, mon = 3) {
	const currentDate = new Date();
	const givenDate = new Date(someDate);

	const differenceInMilliseconds = currentDate - givenDate;
	const differenceInDays = differenceInMilliseconds / (24 * 60 * 60 * 1000);

	// 일수 차이가 90일인지 확인
	return Math.abs(differenceInDays) < 30 * mon;
}

function convertToCSV(data) {
	const csvArray = [Object.values(config.headers).join(",")];

	for (const item of data) {
		const row = Object.keys(config.headers).map(header => {
			const value = item[header] || "";
			return `"${value.trim().replace(/"/g, '""')}"`;
		});
		csvArray.push(row.join(","));
	}

	return csvArray.join("\n");
}

function saveToFile(filename, content) {
	const dir = path.dirname(filename);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	fs.writeFile(filename, content, "utf8", err => {
		if (err) {
			console.error("Error writing to file:", err);
		} else {
			console.log(`✅ File saved as ${filename}`);
		}
	});
}

function convertAndSaveCSV(filename, content) {
	saveToFile(`./results/${filename}.csv`, convertToCSV(content));
}

function checkIfAnyWordInString(words, str) {
	const regex = new RegExp(words.join("|"), "i"); // 단어들을 OR(|)로 연결한 정규 표현식
	return regex.test(str.toLowerCase()); // 문자열에 정규 표현식과 일치하는 부분이 있는지 확인
}

module.exports = {
	toStringByFormatting,
	isInMonths,
	convertAndSaveCSV,
	checkIfAnyWordInString,
};
