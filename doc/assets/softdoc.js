var renderer = new marked.Renderer();
renderer.code = function (code, language) {
    if(language === 'mermaid')
        return '<div class="mermaid">' + code + '</div>';
    else {
        var validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
        return '<pre><code class="hljs ' + validLanguage + '">' + hljs.highlight(validLanguage, code).value + '</code></pre>';
    }
};
marked.setOptions({ renderer: renderer });

function handleLink() {
    loadMarkdown(this.getAttribute('href'), '#content');
    event.preventDefault();
    return false;
}

function handleAllLinks() {
    for (atag of document.querySelectorAll('a')) {
        atag.removeEventListener('click', handleLink);
        if (/^(http(s)?:\/\/)/.test(atag.getAttribute('href')))
            atag.setAttribute('target', '_blank');
        else {
            atag.addEventListener('click', handleLink);
        }
    }
}

async function loadMarkdown(url, targetselector) {
    var source = await (await fetch(url, { mode: 'no-cors' })).text();
    var html = marked(source);
    document.querySelector(targetselector).innerHTML = html;
    mermaid.init();
    handleAllLinks();
}

window.addEventListener('load', async () => {
    await loadMarkdown('SIDEBAR.md', '#sidebar');
    await loadMarkdown('CONTENT.md', '#content');
    mermaid.mermaidAPI.initialize({ securityLevel: 'loose' });
});
