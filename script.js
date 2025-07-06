// 명언 데이터 저장 변수
let quotes = [];
let currentQuoteIndex = -1;
let previousQuoteIndex = -1;

// DOM 요소 선택
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuoteBtn');

// 애니메이션 지속 시간 (밀리초)
const ANIMATION_DURATION = 500;

/**
 * quotes.json 파일에서 명언 데이터를 로드합니다.
 */
async function loadQuotes() {
    try {
        const response = await fetch('quotes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quotes = await response.json();
        
        // 데이터 로드 완료 후 첫 번째 명언 표시
        if (quotes.length > 0) {
            displayRandomQuote();
        } else {
            showError('명언 데이터가 없습니다.');
        }
    } catch (error) {
        console.error('명언 데이터 로드 실패:', error);
        showError('명언을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
}

/**
 * 랜덤한 명언을 선택하여 반환합니다.
 * 이전에 표시된 명언과 중복되지 않도록 처리합니다.
 */
function getRandomQuote() {
    if (quotes.length === 0) {
        return null;
    }
    
    if (quotes.length === 1) {
        return quotes[0];
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quotes.length);
    } while (randomIndex === previousQuoteIndex);
    
    previousQuoteIndex = currentQuoteIndex;
    currentQuoteIndex = randomIndex;
    
    return quotes[randomIndex];
}

/**
 * 선택된 명언을 화면에 표시합니다.
 * 부드러운 페이드 인/아웃 효과를 적용합니다.
 */
function displayRandomQuote() {
    const quote = getRandomQuote();
    
    if (!quote) {
        showError('명언을 불러올 수 없습니다.');
        return;
    }
    
    // 페이드 아웃 효과
    quoteText.classList.add('fade-out');
    quoteAuthor.classList.add('fade-out');
    
    // 애니메이션 완료 후 내용 변경 및 페이드 인
    setTimeout(() => {
        quoteText.textContent = quote.quote;
        quoteAuthor.textContent = `- ${quote.author}`;
        
        // 페이드 인 효과
        quoteText.classList.remove('fade-out');
        quoteAuthor.classList.remove('fade-out');
        quoteText.classList.add('fade-in');
        quoteAuthor.classList.add('fade-in');
        
        // 애니메이션 클래스 정리
        setTimeout(() => {
            quoteText.classList.remove('fade-in');
            quoteAuthor.classList.remove('fade-in');
        }, ANIMATION_DURATION);
        
    }, ANIMATION_DURATION);
}

/**
 * 에러 메시지를 표시합니다.
 */
function showError(message) {
    quoteText.textContent = message;
    quoteAuthor.textContent = '';
    quoteText.classList.remove('fade-out');
    quoteAuthor.classList.remove('fade-out');
}

/**
 * 버튼 클릭 시 새로운 명언을 표시합니다.
 * 버튼 중복 클릭을 방지합니다.
 */
function handleNewQuoteClick() {
    // 버튼 비활성화 (중복 클릭 방지)
    newQuoteBtn.disabled = true;
    newQuoteBtn.style.opacity = '0.7';
    
    // 새 명언 표시
    displayRandomQuote();
    
    // 애니메이션 완료 후 버튼 재활성화
    setTimeout(() => {
        newQuoteBtn.disabled = false;
        newQuoteBtn.style.opacity = '1';
    }, ANIMATION_DURATION * 2);
}

/**
 * 키보드 접근성을 위한 키 이벤트 처리
 */
function handleKeyDown(event) {
    // 스페이스바 또는 엔터 키로 새 명언 보기
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (!newQuoteBtn.disabled) {
            handleNewQuoteClick();
        }
    }
}

/**
 * 페이지 로드 완료 시 실행되는 초기화 함수
 */
function init() {
    // 명언 데이터 로드
    loadQuotes();
    
    // 이벤트 리스너 등록
    newQuoteBtn.addEventListener('click', handleNewQuoteClick);
    document.addEventListener('keydown', handleKeyDown);
    
    // 접근성 향상을 위한 버튼 포커스 설정
    newQuoteBtn.setAttribute('tabindex', '0');
    newQuoteBtn.setAttribute('aria-label', '새로운 명언 보기');
}

// 페이지 로드 시 초기화 실행
document.addEventListener('DOMContentLoaded', init);

// 페이지 가시성 변경 시 새로운 명언 표시 (옵션)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && quotes.length > 0) {
        // 페이지가 다시 보일 때 새로운 명언 표시
        setTimeout(() => {
            if (!newQuoteBtn.disabled) {
                displayRandomQuote();
            }
        }, 1000);
    }
});

// 전역 에러 핸들링
window.addEventListener('error', (event) => {
    console.error('전역 에러:', event.error);
    showError('오류가 발생했습니다. 페이지를 새로고침해주세요.');
}); 