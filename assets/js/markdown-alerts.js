(() => {
    const variants = {
        NOTE: { title: 'Note', icon: 'ℹ️' },
        TIP: { title: 'Tip', icon: '💡' },
        IMPORTANT: { title: 'Important', icon: '❗' },
        WARNING: { title: 'Warning', icon: '⚠️' },
        CAUTION: { title: 'Caution', icon: '🛑' }
    };

    function convertAlerts() {
        document.querySelectorAll('.markdown-body blockquote').forEach((blockquote) => {
            if (blockquote.closest('pre, code')) return;

            const paragraph = blockquote.firstElementChild;
            if (paragraph?.tagName !== 'P') return;

            const marker = paragraph.firstChild;
            if (marker?.nodeType !== Node.TEXT_NODE) return;

            // マーカーだけの先頭行を対象にする。本文と同じ行の表記は変換しない。
            const match = marker.data.match(/^[ \t]*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:\r?\n|$)/);
            if (!match) return;

            const lineBreak = marker.nextSibling;
            const hasNewline = match[0].endsWith('\n');
            if (!hasNewline && lineBreak && lineBreak.nodeName !== 'BR') return;

            const type = match[1];
            const variant = variants[type];

            // Kramdown の <br> と、改行文字のみを出す変換器の両方に対応する。
            marker.deleteData(0, match[0].length);
            if (marker.length === 0) marker.remove();
            if (!hasNewline && lineBreak?.nodeName === 'BR') lineBreak.remove();
            if (paragraph.children.length === 0 && !paragraph.textContent.trim()) {
                paragraph.remove();
            }

            const alert = document.createElement('div');
            for (const attribute of blockquote.attributes) {
                alert.setAttribute(attribute.name, attribute.value);
            }
            alert.classList.add('markdown-alert', `markdown-alert-${type.toLowerCase()}`);

            const title = document.createElement('p');
            title.className = 'markdown-alert-title';

            const icon = document.createElement('span');
            icon.className = 'markdown-alert-icon';
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = variant.icon;
            title.append(icon, document.createTextNode(` ${variant.title}`));
            alert.append(title);

            // 既存の要素を移動し、リンク・強調・リスト・コードなどを保つ。
            while (blockquote.firstChild) alert.append(blockquote.firstChild);
            blockquote.replaceWith(alert);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', convertAlerts, { once: true });
    } else {
        convertAlerts();
    }
})();
