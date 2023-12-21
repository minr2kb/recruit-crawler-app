/**
 * IOS 환경의 크롬 또는 사파리 브라우저인지 판단하는 함수
 * @remarks
 * NOTE 브라우저 환경에서만 정삭동작하는 모듈임.
 * TODO 잠재적인 빌드 에러등을 막기 위해 추후 common-utils 말고 common-browser-utils 를 구성할 것
 *
 * @param windowTarget
 * @returns
 */
const isSafariOrChromeIOS = (windowTarget: Window & typeof globalThis) => {
  const ua = windowTarget.navigator.userAgent
  const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i)
  const webkit = !!ua.match(/WebKit/i)
  return iOS && webkit
}

export default isSafariOrChromeIOS
