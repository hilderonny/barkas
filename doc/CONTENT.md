# Software-Dokumentation

Dieses Projekt soll ein Anhaltspunkt für Softwaredokumentation sein. Es zeigt, wie man Dokumentation angefangen von Spezifikationen mit Diagrammen bis hin zu Klassen- und Funktionsbeschreibungen oder Bedienungsanleitungen relativ simpel und einfach wartbar schreiben kann.

## Wie fange ich an?

Zunächst stellen sich die Fragen, wo man am Besten Dokumentation schreibt und wie man diese der Leserschaft zur Verfügung stellt.

Ich gehe davon aus, dass ein Software-Projekt bzw. dessen Quellen in einem Repository (genauer [GitLab](https://gitlab.com)) gespeichert wird. Was spricht also dagegen, die Dokumentation ebenfalls dort zu speichern? Dann hat man gleich eine Versionierung der Dokumentation selbst und im Falle von GitLab kann man [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/) verwenden, um die Dokumentation zu hosten und zugänglich zu machen.

Unter [Getting started](GETTINGSTARTED.md) beschreibe ich, wie dieses Repository hier eingerichtet wird. Das kann dann als Vorlage für andere Software-Projekte verwendet werden.

## Welches Format und welche Tools verwende ich?

Ich habe mich für [MarkDown](https://de.wikipedia.org/wiki/Markdown) als Dokumentationssprache entschieden. Das sind die Gründe:

1. Man kann gut Dokumente formatieren, Medien einbinden, Inhalte verlinken, und eine ganze Menge, was man mit HTML auch machen kann
2. Es hat eine einfachere Syntax als HTML
3. Es ist ein Textformat, welches system- und toolunabhängig bearbeitet werden kann
4. Es wird bereits in vielen Projekten und Wikis verwendet und hat daher eine kleine Lernkurve
5. Durch das Textformat kann es sehr gut versioniert und Änderungen nachverfolgt werden
6. Durch Parser kann das Format einfach in HTML für Browser umgewandelt werden
7. Durch Plugins hat es gute Darstellungsmöglichkeiten für Quellcode und Diagramme (Letzteres ebenfalls textuell)

Die MarkDown-Dateien werden clientseitig im Browser mit [marked.js](https://marked.js.org/#/README.md#README.md) in HTML umgewandelt.

Dabei werden die Plugins [mermaid.js](https://mermaid-js.github.io/mermaid/#/) zum Generieren von Diagrammensowie [highlight.js](https://highlightjs.org/) zum farblichen Formatieren von Code-Blöcken verwendet.

Die Auifhübschung wird ausschließlich durch [eine CSS Datei](assets/softdoc.css) erledigt.

Zum Programmieren verwende ich [Visual Studio Code](https://code.visualstudio.com/) mit dem [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) Plugin, damit ich während des MarkDown-Schreibens Diagramme live in der Vorschau sehen kann.

![](https://github.com/mjbvz/vscode-markdown-mermaid/raw/master/docs/example.png)

Zusätzlich benutze ich die Erweiterung [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). Damit kann man aus VS Code heraus einen Mini-Webserver starten, der das doc-Verzeichnis hostet. Das ist manchmal für die Ajax-Funktionen notwendig, die wegen der ganzen CORS-Geschichte nur von localhost aus und nicht über das `file://` Protokoll funktionieren.

## Wie funktioniert das Rendering?

Das Rendering erfolgt ausschließlich clientseitig im Browser durch die Dateien `index.html` sowie `softdoc.js`. Diese laden die Markdown-Dateien und formatieren sie für die Anzeige.

Die Prozesse des Ladens, Formatierens und Renderns sind unter [Render-Prozess](umsetzung/RENDERING.md) beschrieben.

Die technische Funktionsweise wird in [softdoc.js](umsetzung/SOFTDOC.md) beschrieben.

## Wie schreibe ich denn nun die Dokumentation?

Es geht hierbei um "best practices" zum Schreiben von Konzepten, Änderungswünschen, Benutzerdokus und Funktionsbeschreibungen.

Das alles wird unter [Best practices](bestpractices/BESTPRACTICES.md) genauer erläutert.