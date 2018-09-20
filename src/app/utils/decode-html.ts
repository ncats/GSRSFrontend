export function decodeHtml(htmlString: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = htmlString;
    return txt.value;
}
