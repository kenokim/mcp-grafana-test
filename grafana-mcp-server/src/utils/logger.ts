/**
 * 로깅 유틸리티 클래스
 */
export class Logger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * 정보 로그
   */
  info(message: string, data?: any): void {
    this.log('INFO', message, data);
  }

  /**
   * 에러 로그
   */
  error(message: string, error?: any): void {
    this.log('ERROR', message, error);
  }

  /**
   * 경고 로그
   */
  warn(message: string, data?: any): void {
    this.log('WARN', message, data);
  }

  /**
   * 디버그 로그
   */
  debug(message: string, data?: any): void {
    this.log('DEBUG', message, data);
  }

  /**
   * 로그 출력 메서드
   */
  private log(level: string, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] [${this.prefix}] ${message}`;
    
    // 글로벌 console 객체가 존재하는 환경에서만 실행
    if (typeof console !== 'undefined') {
      switch (level) {
        case 'ERROR':
          console.error(formattedMessage);
          if (data) console.error(data);
          break;
        case 'WARN':
          console.warn(formattedMessage);
          if (data) console.warn(data);
          break;
        case 'DEBUG':
          console.debug(formattedMessage);
          if (data) console.debug(data);
          break;
        default:
          console.log(formattedMessage);
          if (data) console.log(data);
      }
    }
  }
} 