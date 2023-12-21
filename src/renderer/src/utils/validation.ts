/* eslint-disable no-plusplus */
export function isEmailValid(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return emailRegex.test(email)
}

export function isNumeric(input: string): boolean {
  return /^\d+$/.test(input)
}

/**
 *
 * 10자리 이상, 영문, 대소문자, 특수문자 등을 2가지 이상 섞어서
 */
export function isPasswordValid(password: string): boolean {
  // Check length
  if (password.length < 10) {
    return false
  }

  // Check types of characters
  const letterRegex = /[a-zA-Z]/
  const numberRegex = /[0-9]/
  const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
  const latinCharRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/
  let numTypes = 0

  if (letterRegex.test(password)) {
    numTypes++
  }
  if (numberRegex.test(password)) {
    numTypes++
  }
  if (specialCharRegex.test(password)) {
    numTypes++
  }
  if (!latinCharRegex.test(password)) {
    return false
  }

  return numTypes >= 2
}

export const getDeviceTypeByUserAgent = (userAgentStr: string) => {
  if (/Android/i.test(userAgentStr)) {
    return 'Android'
  }
  if (/iPhone|iPad|iPod/i.test(userAgentStr)) {
    return 'iOS'
  }
  if (/Windows Phone/i.test(userAgentStr)) {
    return 'Windows Phone'
  }
  if (/Windows/i.test(userAgentStr)) {
    return 'Windows PC'
  }
  if (/Macintosh/i.test(userAgentStr)) {
    return 'Macintosh'
  }
  if (/Linux/i.test(userAgentStr)) {
    return 'Linux'
  }
  return 'Unknown'
}

export function isInMonths(someDate: string, mon = 3) {
  const currentDate = new Date()
  const givenDate = new Date(someDate)

  const differenceInMilliseconds = currentDate.valueOf() - givenDate.valueOf()
  const differenceInDays = differenceInMilliseconds / (24 * 60 * 60 * 1000)

  // 일수 차이가 90일인지 확인
  return Math.abs(differenceInDays) < 30 * mon
}

export function checkIfAnyWordInString(words: string[], str: string) {
  const regex = new RegExp(words.join('|'), 'i') // 단어들을 OR(|)로 연결한 정규 표현식
  return regex.test(str.toLowerCase()) // 문자열에 정규 표현식과 일치하는 부분이 있는지 확인
}
