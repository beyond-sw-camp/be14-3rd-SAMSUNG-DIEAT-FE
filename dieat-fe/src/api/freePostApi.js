const BASE_URL = 'http://localhost:3000/freeposts';

/**
 * 전체 게시글 목록 가져오기
 */
export async function fetchPosts() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('게시글 불러오기 실패');
    return await res.json();
}

/**
 * 특정 ID의 게시글 가져오기
 */
export async function fetchPostById(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('상세 게시글 불러오기 실패');
    return await res.json();
}