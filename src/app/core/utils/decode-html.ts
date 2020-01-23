/**
 * Decodes an html encoded string to plain text.
 * @param htmlString Do not pass an entire element, only its innerHtml
 * @returns decoded plain text
 */
export function decodeHtml(htmlString: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = htmlString;
    return txt.value;
}
