// vite.config.js
export default {
  build: {
    minify: 'terser', // Terser로 코드 압축
    terserOptions: {
      compress: {
        drop_console: true, // 콘솔 로그 제거
        drop_debugger: true // 디버거 제거
      },
      mangle: true,
      format: {
        comments: false, // 주석 제거
        beautify: false,  // 코드 '예쁘게 만들기' 비활성화
      },
      keep_classnames: false,
      keep_fnames: false
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // node_modules 내의 라이브러리를 별도의 청크로 분리
            return 'vendor';
          }
        }
      }
    }
  }
};
