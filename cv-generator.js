// cv-generator.js — Generatore CV dinamico con riordinamento drag-and-drop
(function () {
    'use strict';

    // --- Helpers ---
    function getSiteLang() {
        return localStorage.getItem('portfolio-lang') || 'it';
    }

    // Lingua scelta per il CV (indipendente dal sito)
    var cvLang = 'it';

    function t(obj, lang) {
        if (obj == null) return '';
        if (typeof obj === 'string') return obj;
        var l = lang || cvLang;
        return obj[l] || obj.it || '';
    }

    // Ordine sezioni corrente (viene aggiornato dal drag-and-drop)
    var sectionOrder = [];

    // SVG icona drag handle (6 puntini)
    var gripSvg = '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>';

    // --- Render toggle con drag handle ---
    function renderSectionToggles() {
        var container = document.getElementById('cvSectionsList');
        if (!container) return;
        container.innerHTML = '';

        // Inizializza ordine sezioni
        sectionOrder = CV_DATA.sections.map(function (s) { return s.key; });

        CV_DATA.sections.forEach(function (section) {
            var row = document.createElement('div');
            row.className = 'cv-section-row';
            row.setAttribute('draggable', 'true');
            row.dataset.key = section.key;

            row.innerHTML =
                '<div class="cv-drag-handle" title="Trascina per riordinare">' + gripSvg + '</div>' +
                '<label class="cv-toggle-label">' +
                    '<input type="checkbox" checked data-section="' + section.key + '">' +
                    '<span class="cv-toggle-switch"></span>' +
                    '<span class="cv-toggle-text">' + t(section.label, getSiteLang()) + '</span>' +
                '</label>';

            container.appendChild(row);
        });

        initDragAndDrop(container);
    }

    // --- Drag and Drop ---
    function initDragAndDrop(container) {
        var draggedEl = null;

        container.addEventListener('dragstart', function (e) {
            var row = e.target.closest('.cv-section-row');
            if (!row) return;
            draggedEl = row;
            row.classList.add('cv-dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', row.dataset.key);
        });

        container.addEventListener('dragend', function () {
            if (draggedEl) {
                draggedEl.classList.remove('cv-dragging');
                draggedEl = null;
            }
            // Rimuovi tutti gli indicatori
            var rows = container.querySelectorAll('.cv-section-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('cv-drag-over');
            }
        });

        container.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            var row = e.target.closest('.cv-section-row');
            if (!row || row === draggedEl) return;

            // Rimuovi indicatori precedenti
            var rows = container.querySelectorAll('.cv-section-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('cv-drag-over');
            }
            row.classList.add('cv-drag-over');
        });

        container.addEventListener('dragleave', function (e) {
            var row = e.target.closest('.cv-section-row');
            if (row) row.classList.remove('cv-drag-over');
        });

        container.addEventListener('drop', function (e) {
            e.preventDefault();
            var targetRow = e.target.closest('.cv-section-row');
            if (!targetRow || !draggedEl || targetRow === draggedEl) return;

            // Inserisci prima del target
            container.insertBefore(draggedEl, targetRow);

            // Aggiorna ordine sezioni
            var rows = container.querySelectorAll('.cv-section-row');
            sectionOrder = [];
            for (var i = 0; i < rows.length; i++) {
                sectionOrder.push(rows[i].dataset.key);
                rows[i].classList.remove('cv-drag-over');
            }
        });

        // Touch support per mobile
        var touchDragged = null;
        var touchClone = null;
        var touchStartY = 0;

        container.addEventListener('touchstart', function (e) {
            var handle = e.target.closest('.cv-drag-handle');
            if (!handle) return;
            var row = handle.closest('.cv-section-row');
            if (!row) return;

            touchDragged = row;
            touchStartY = e.touches[0].clientY;

            // Crea clone visuale
            touchClone = row.cloneNode(true);
            touchClone.style.position = 'fixed';
            touchClone.style.zIndex = '10000';
            touchClone.style.width = row.offsetWidth + 'px';
            touchClone.style.opacity = '0.8';
            touchClone.style.pointerEvents = 'none';
            touchClone.style.left = row.getBoundingClientRect().left + 'px';
            touchClone.style.top = row.getBoundingClientRect().top + 'px';
            document.body.appendChild(touchClone);

            row.classList.add('cv-dragging');
        }, { passive: true });

        container.addEventListener('touchmove', function (e) {
            if (!touchDragged || !touchClone) return;
            e.preventDefault();

            var touch = e.touches[0];
            touchClone.style.top = touch.clientY - 20 + 'px';

            // Trova l'elemento sotto il touch
            touchClone.style.display = 'none';
            var elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            touchClone.style.display = '';

            var rows = container.querySelectorAll('.cv-section-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('cv-drag-over');
            }

            if (elemBelow) {
                var targetRow = elemBelow.closest('.cv-section-row');
                if (targetRow && targetRow !== touchDragged) {
                    targetRow.classList.add('cv-drag-over');
                }
            }
        }, { passive: false });

        container.addEventListener('touchend', function () {
            if (!touchDragged) return;

            // Trova il target con cv-drag-over
            var target = container.querySelector('.cv-drag-over');
            if (target && target !== touchDragged) {
                container.insertBefore(touchDragged, target);
            }

            // Cleanup
            touchDragged.classList.remove('cv-dragging');
            if (touchClone && touchClone.parentNode) {
                touchClone.parentNode.removeChild(touchClone);
            }

            // Aggiorna ordine
            var rows = container.querySelectorAll('.cv-section-row');
            sectionOrder = [];
            for (var i = 0; i < rows.length; i++) {
                sectionOrder.push(rows[i].dataset.key);
                rows[i].classList.remove('cv-drag-over');
            }

            touchDragged = null;
            touchClone = null;
        });
    }

    // --- PDF vettoriale in stile Deedy ---
    var PDF_COLORS = {
        text: '#2f2f2f',
        black: '#111111',
        heading: '#6c6c6c',
        muted: '#777777',
        light: '#9a9a9a',
        rule: '#b8b8b8',
        faintRule: '#dddddd'
    };

    var MONTHS = {
        gen: 1, gennaio: 1, jan: 1, january: 1,
        feb: 2, febbraio: 2, february: 2,
        mar: 3, marzo: 3, march: 3,
        apr: 4, aprile: 4, april: 4,
        mag: 5, maggio: 5, may: 5,
        giu: 6, giugno: 6, jun: 6, june: 6,
        lug: 7, luglio: 7, jul: 7, july: 7,
        ago: 8, agosto: 8, aug: 8, august: 8,
        set: 9, settembre: 9, sep: 9, sept: 9, september: 9,
        ott: 10, ottobre: 10, oct: 10, october: 10,
        nov: 11, novembre: 11, november: 11,
        dic: 12, dicembre: 12, dec: 12, december: 12
    };

    function cleanText(value) {
        return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
    }

    function pdfText(value) {
        return cleanText(t(value))
            .replace(/[\u2010-\u2015]/g, '-')
            .replace(/\u00a0/g, ' ');
    }

    function rawDateText(value) {
        if (value == null) return '';
        if (typeof value === 'string') return value;
        return value.it || value.en || t(value);
    }

    function parseDatePoint(text, isEnd) {
        var normalized = cleanText(text).toLowerCase().replace(/\./g, '');
        if (/presente|present|current|oggi/.test(normalized)) return 999912;

        var monthPattern = '(gennaio|gen|january|jan|febbraio|feb|february|marzo|mar|march|aprile|apr|april|maggio|mag|may|giugno|giu|june|jun|luglio|lug|july|jul|agosto|ago|august|aug|settembre|set|september|sept|sep|ottobre|ott|october|oct|novembre|nov|november|dicembre|dic|december|dec)';
        var monthMatch = normalized.match(new RegExp('\\b' + monthPattern + '\\s+(19\\d{2}|20\\d{2})\\b'));
        if (monthMatch) {
            return Number(monthMatch[2]) * 100 + MONTHS[monthMatch[1]];
        }

        var years = normalized.match(/\b(19\d{2}|20\d{2})\b/g);
        if (years && years.length) {
            var year = Number(isEnd ? years[years.length - 1] : years[0]);
            return year * 100 + (isEnd ? 12 : 1);
        }

        return 0;
    }

    function chronologicalScore(item, index) {
        var parts = rawDateText(item.date).split(/\s+[—–-]\s+/);
        var start = parseDatePoint(parts[0], false);
        var end = parts.length > 1 ? parseDatePoint(parts[parts.length - 1], true) : parseDatePoint(parts[0], true);
        return { item: item, start: start, end: end, index: index };
    }

    function sortItemsByDateDesc(items) {
        return items.map(chronologicalScore).sort(function (a, b) {
            if (b.end !== a.end) return b.end - a.end;
            if (b.start !== a.start) return b.start - a.start;
            return a.index - b.index;
        }).map(function (entry) {
            return entry.item;
        });
    }

    function hexToRgb(hex) {
        var normalized = hex.replace('#', '');
        return {
            r: parseInt(normalized.slice(0, 2), 16),
            g: parseInt(normalized.slice(2, 4), 16),
            b: parseInt(normalized.slice(4, 6), 16)
        };
    }

    function setTextColor(doc, hex) {
        var color = hexToRgb(hex);
        doc.setTextColor(color.r, color.g, color.b);
    }

    function setDrawColor(doc, hex) {
        var color = hexToRgb(hex);
        doc.setDrawColor(color.r, color.g, color.b);
    }

    function setFillColor(doc, hex) {
        var color = hexToRgb(hex);
        doc.setFillColor(color.r, color.g, color.b);
    }

    function setFont(doc, size, style, color) {
        doc.setFont('helvetica', style || 'normal');
        doc.setFontSize(size);
        setTextColor(doc, color || PDF_COLORS.text);
    }

    function lineHeight(size, multiplier) {
        return size * 0.3528 * (multiplier || 1.32);
    }

    function createPdfState(doc) {
        var marginL = 12.8;
        var marginR = 12.8;
        var leftW = 61.5;
        var gap = 8.5;
        var pageW = 215.9;
        var rightX = marginL + leftW + gap;
        return {
            doc: doc,
            pageW: pageW,
            pageH: 279.4,
            marginL: marginL,
            marginR: marginR,
            marginT: 10.5,
            marginB: 10.5,
            leftX: marginL,
            leftW: leftW,
            rightX: rightX,
            rightW: pageW - marginR - rightX,
            headerBottom: 34.5,
            initialY: 39,
            leftY: 39,
            rightY: 39,
            currentPage: 1
        };
    }

    function pageBottom(state) {
        return state.pageH - state.marginB;
    }

    function drawContinuationHeader(state) {
        var doc = state.doc;
        setFont(doc, 7.5, 'normal', PDF_COLORS.muted);
        doc.text('Tommaso Patriti', state.marginL, 11.5);
        doc.text('Curriculum Vitae', state.pageW - state.marginR, 11.5, { align: 'right' });
        setDrawColor(doc, PDF_COLORS.faintRule);
        doc.setLineWidth(0.25);
        doc.line(state.marginL, 15, state.pageW - state.marginR, 15);
        state.leftY = 22;
        state.rightY = 22;
    }

    function addPage(state) {
        state.doc.addPage();
        state.currentPage = state.doc.getNumberOfPages();
        drawContinuationHeader(state);
    }

    function setPdfPage(state, pageNumber) {
        state.doc.setPage(pageNumber);
        state.currentPage = pageNumber;
    }

    function moveToNextPage(state) {
        var nextPage = state.currentPage + 1;
        if (nextPage <= state.doc.getNumberOfPages()) {
            setPdfPage(state, nextPage);
            state.leftY = 22;
            state.rightY = 22;
        } else {
            addPage(state);
        }
    }

    function columnX(state, column) {
        return column === 'left' ? state.leftX : state.rightX;
    }

    function columnW(state, column) {
        return column === 'left' ? state.leftW : state.rightW;
    }

    function getColumnY(state, column) {
        return column === 'left' ? state.leftY : state.rightY;
    }

    function setColumnY(state, column, y) {
        if (column === 'left') state.leftY = y;
        else state.rightY = y;
    }

    function ensureColumnSpace(state, column, height) {
        if (getColumnY(state, column) + height > pageBottom(state)) {
            moveToNextPage(state);
        }
    }

    function wrapText(doc, text, width, size, style) {
        setFont(doc, size, style || 'normal', PDF_COLORS.text);
        return doc.splitTextToSize(pdfText(text), width);
    }

    function measureText(doc, text, width, size, style, multiplier) {
        return wrapText(doc, text, width, size, style).length * lineHeight(size, multiplier || 1.25);
    }

    function drawLines(state, lines, x, y, size, style, color, multiplier) {
        var doc = state.doc;
        var lh = lineHeight(size, multiplier);
        setFont(doc, size, style || 'normal', color || PDF_COLORS.text);
        for (var i = 0; i < lines.length; i++) {
            doc.text(lines[i], x, y);
            y += lh;
        }
        return y;
    }

    function drawLinkLine(state, column, prefix, label, url) {
        var doc = state.doc;
        var x = columnX(state, column);
        var y = getColumnY(state, column);
        var text = prefix + ' ' + label;
        ensureColumnSpace(state, column, lineHeight(8.5, 1.25));
        setFont(doc, 8.5, 'normal', PDF_COLORS.muted);
        if (typeof doc.textWithLink === 'function') {
            doc.textWithLink(text, x, y, { url: url });
        } else {
            doc.text(text, x, y);
            doc.link(x, y - 3.2, doc.getTextWidth(text), 4.2, { url: url });
        }
        setColumnY(state, column, y + lineHeight(8.5, 1.2));
    }

    function drawHeader(state) {
        var doc = state.doc;
        var m = CV_DATA.meta;
        var first = 'Tommaso';
        var last = 'Patriti';
        var titleLine = pdfText(m.title);
        var contactLine = [m.email, m.phone, m.github, m.linkedin].join(' | ');
        var yName = 17.2;

        setFont(doc, 34, 'normal', PDF_COLORS.light);
        var firstWidth = doc.getTextWidth(first + ' ');
        setFont(doc, 34, 'normal', PDF_COLORS.black);
        var lastWidth = doc.getTextWidth(last);
        var startX = (state.pageW - firstWidth - lastWidth) / 2;

        setFont(doc, 34, 'normal', PDF_COLORS.light);
        doc.text(first, startX, yName);
        setFont(doc, 34, 'normal', PDF_COLORS.black);
        doc.text(last, startX + firstWidth, yName);

        setFont(doc, 9.4, 'normal', PDF_COLORS.muted);
        doc.text(titleLine, state.pageW / 2, 24.2, { align: 'center' });
        setFont(doc, 8.2, 'normal', PDF_COLORS.muted);
        doc.text(contactLine, state.pageW / 2, 29.2, { align: 'center' });

        setDrawColor(doc, PDF_COLORS.rule);
        doc.setLineWidth(0.28);
        doc.line(0, state.headerBottom, state.pageW, state.headerBottom);
    }

    function sectionByKey(key) {
        for (var i = 0; i < CV_DATA.sections.length; i++) {
            if (CV_DATA.sections[i].key === key) return CV_DATA.sections[i];
        }
        return null;
    }

    function hasSelected(selectedKeys, key) {
        return selectedKeys.indexOf(key) !== -1 && sectionByKey(key);
    }

    function drawSectionHeading(state, column, label) {
        var doc = state.doc;
        var y = getColumnY(state, column);
        if (y > state.initialY) y += 4.4;
        ensureColumnSpace(state, column, 12);
        y = getColumnY(state, column);
        if (y > state.initialY) y += 4.4;

        setFont(doc, column === 'left' ? 14.6 : 16, 'bold', PDF_COLORS.heading);
        doc.text(pdfText(label).toUpperCase(), columnX(state, column), y);
        setColumnY(state, column, y + (column === 'left' ? 7.2 : 7.8));
    }

    function drawCategoryHeading(state, column, label) {
        var doc = state.doc;
        var y = getColumnY(state, column);
        ensureColumnSpace(state, column, 7);
        y = getColumnY(state, column);
        setFont(doc, 8.4, 'bold', PDF_COLORS.text);
        doc.text(pdfText(label).toUpperCase(), columnX(state, column), y);
        setColumnY(state, column, y + 4.5);
    }

    function tagsText(tags) {
        return (tags || []).map(function (tag) {
            return pdfText(tag);
        }).filter(Boolean).join(' • ');
    }

    function drawInlineTags(state, column, tags, size) {
        var doc = state.doc;
        var text = tagsText(tags);
        if (!text) return;
        var width = columnW(state, column);
        var lines = wrapText(doc, text, width, size || 7.6, 'normal');
        var height = lines.length * lineHeight(size || 7.6, 1.22) + 1;
        ensureColumnSpace(state, column, height);
        var y = getColumnY(state, column);
        y = drawLines(state, lines, columnX(state, column), y, size || 7.6, 'normal', PDF_COLORS.muted, 1.22);
        setColumnY(state, column, y + 1.2);
    }

    function measureInlineTagsHeight(state, column, tags, size) {
        var text = tagsText(tags);
        if (!text) return 0;
        var lines = wrapText(state.doc, text, columnW(state, column), size || 7.6, 'normal');
        return lines.length * lineHeight(size || 7.6, 1.22) + 2.2;
    }

    function drawParagraph(state, column, text, size, color, multiplier) {
        var doc = state.doc;
        var width = columnW(state, column);
        var lines = wrapText(doc, text, width, size, 'normal');
        var height = lines.length * lineHeight(size, multiplier || 1.25);
        ensureColumnSpace(state, column, height);
        var y = getColumnY(state, column);
        y = drawLines(state, lines, columnX(state, column), y, size, 'normal', color || PDF_COLORS.muted, multiplier || 1.25);
        setColumnY(state, column, y + 1.6);
    }

    function itemLinksHeight(item, width) {
        if (!item.links || !item.links.length) return 0;
        var total = 0;
        item.links.forEach(function (link) {
            total += measureText(itemLinksHeight.doc, link.label || link.url, width, 7.6, 'normal', 1.2);
        });
        return total + 1;
    }

    function drawItemLinks(state, column, item) {
        if (!item.links || !item.links.length) return;
        var doc = state.doc;
        var x = columnX(state, column);
        var y = getColumnY(state, column);
        setFont(doc, 7.6, 'normal', PDF_COLORS.muted);
        item.links.forEach(function (link) {
            var label = pdfText(link.label || link.url);
            if (typeof doc.textWithLink === 'function') {
                doc.textWithLink(label, x, y, { url: link.url });
            } else {
                doc.text(label, x, y);
                doc.link(x, y - 3, doc.getTextWidth(label), 4, { url: link.url });
            }
            y += lineHeight(7.6, 1.2);
        });
        setColumnY(state, column, y + 1);
    }

    function measureEducationItem(state, item) {
        var doc = state.doc;
        var width = state.leftW;
        var company = measureText(doc, item.company, width, 9.4, 'bold', 1.12);
        var title = measureText(doc, item.title, width, 8.2, 'normal', 1.16);
        var date = measureText(doc, item.date, width, 7.9, 'normal', 1.14);
        itemLinksHeight.doc = doc;
        return company + title + date + itemLinksHeight(item, width) + 3.4;
    }

    function drawEducationItem(state, item) {
        var doc = state.doc;
        var column = 'left';
        ensureColumnSpace(state, column, measureEducationItem(state, item));
        var x = columnX(state, column);
        var y = getColumnY(state, column);
        var width = columnW(state, column);

        y = drawLines(state, wrapText(doc, item.company, width, 9.4, 'bold'), x, y, 9.4, 'bold', PDF_COLORS.text, 1.12);
        y = drawLines(state, wrapText(doc, item.title, width, 8.2, 'normal'), x, y + 0.5, 8.2, 'normal', PDF_COLORS.black, 1.16);
        y = drawLines(state, wrapText(doc, item.date, width, 7.9, 'normal'), x, y + 0.3, 7.9, 'normal', PDF_COLORS.muted, 1.14);
        setColumnY(state, column, y + 0.8);
        drawItemLinks(state, column, item);
        setColumnY(state, column, getColumnY(state, column) + 2.3);
    }

    function drawEducation(state, selectedKeys) {
        if (!hasSelected(selectedKeys, 'education')) return;
        var section = sectionByKey('education');
        drawSectionHeading(state, 'left', section.label);
        sortItemsByDateDesc(section.items).forEach(function (item) {
            drawEducationItem(state, item);
        });
    }

    function drawLinks(state) {
        drawSectionHeading(state, 'left', { it: 'Links', en: 'Links' });
        drawLinkLine(state, 'left', 'Github://', 'Ro0t-set', 'https://github.com/Ro0t-set');
        drawLinkLine(state, 'left', 'LinkedIn://', 'tommaso-patriti', 'https://www.linkedin.com/in/tommaso-patriti/');
        drawLinkLine(state, 'left', 'Web://', CV_DATA.meta.website, 'https://' + CV_DATA.meta.website);
    }

    function drawTagSection(state, selectedKeys, key, column) {
        if (!hasSelected(selectedKeys, key)) return;
        var section = sectionByKey(key);
        drawSectionHeading(state, column, section.label);
        section.categories.forEach(function (cat) {
            var tagSize = column === 'left' ? 7.45 : 8;
            var showCategory = pdfText(cat.label) && pdfText(cat.label).toLowerCase() !== pdfText(section.label).toLowerCase();
            var blockHeight = (showCategory ? 4.5 : 0) + measureInlineTagsHeight(state, column, cat.tags, tagSize);
            ensureColumnSpace(state, column, blockHeight);
            if (showCategory) drawCategoryHeading(state, column, cat.label);
            drawInlineTags(state, column, cat.tags, tagSize);
        });
    }

    function measureExperienceItem(state, item, column, mode) {
        var doc = state.doc;
        var width = columnW(state, column);
        var primary = mode === 'project' ? item.title : item.company;
        var secondary = mode === 'project' ? item.client : item.title;
        var header = pdfText(primary).toUpperCase() + (pdfText(secondary) ? ' | ' + pdfText(secondary) : '');
        var height = measureText(doc, header, width, mode === 'project' ? 9.8 : 10, 'bold', 1.12);
        height += measureText(doc, item.date, width, 8, 'normal', 1.15);
        if (item.description) height += measureText(doc, item.description, width, mode === 'project' ? 8.05 : 8.2, 'normal', 1.23);
        if (item.tech && item.tech.length) height += measureText(doc, tagsText(item.tech), width, 7.15, 'normal', 1.2) + 1.2;
        return height + 4.4;
    }

    function drawExperienceItem(state, item, column, mode) {
        var doc = state.doc;
        var width = columnW(state, column);
        var x = columnX(state, column);
        var height = measureExperienceItem(state, item, column, mode);
        ensureColumnSpace(state, column, height);
        var y = getColumnY(state, column);
        var primary = mode === 'project' ? item.title : item.company;
        var secondary = mode === 'project' ? item.client : item.title;
        var header = pdfText(primary).toUpperCase() + (pdfText(secondary) ? ' | ' + pdfText(secondary) : '');

        y = drawLines(state, wrapText(doc, header, width, mode === 'project' ? 9.8 : 10, 'bold'), x, y, mode === 'project' ? 9.8 : 10, 'bold', PDF_COLORS.text, 1.12);
        y = drawLines(state, wrapText(doc, item.date, width, 8, 'normal'), x, y + 0.2, 8, 'normal', PDF_COLORS.muted, 1.15);
        if (item.description) {
            y = drawLines(state, wrapText(doc, item.description, width, mode === 'project' ? 8.05 : 8.2, 'normal'), x, y + 0.9, mode === 'project' ? 8.05 : 8.2, 'normal', PDF_COLORS.muted, 1.23);
        }
        setColumnY(state, column, y + 0.8);
        if (item.tech && item.tech.length) {
            drawInlineTags(state, column, item.tech, 7.15);
        }
        setColumnY(state, column, getColumnY(state, column) + 2.6);
    }

    function drawTextSection(state, selectedKeys, key, column) {
        if (!hasSelected(selectedKeys, key)) return;
        var section = sectionByKey(key);
        drawSectionHeading(state, column, section.label);
        drawParagraph(state, column, section.content, 8.7, PDF_COLORS.muted, 1.28);
    }

    function drawTimelineSection(state, selectedKeys, key, column) {
        if (!hasSelected(selectedKeys, key)) return;
        var section = sectionByKey(key);
        drawSectionHeading(state, column, section.label);
        sortItemsByDateDesc(section.items).forEach(function (item) {
            drawExperienceItem(state, item, column, 'experience');
        });
    }

    function drawProjectSection(state, selectedKeys, key, column) {
        if (!hasSelected(selectedKeys, key)) return;
        var section = sectionByKey(key);
        drawSectionHeading(state, column, section.label);
        sortItemsByDateDesc(section.items).forEach(function (item) {
            drawExperienceItem(state, item, column, 'project');
        });
    }

    function measureRepoItem(state, item, column) {
        var width = columnW(state, column);
        return measureText(state.doc, item.name + ' | ' + item.lang, width, 9.2, 'bold', 1.14) +
            measureText(state.doc, item.description, width, 8, 'normal', 1.22) + 5.5;
    }

    function drawRepoItem(state, item, column) {
        var doc = state.doc;
        ensureColumnSpace(state, column, measureRepoItem(state, item, column));
        var x = columnX(state, column);
        var y = getColumnY(state, column);
        var width = columnW(state, column);
        var header = item.name + ' | ' + item.lang;
        y = drawLines(state, wrapText(doc, header, width, 9.2, 'bold'), x, y, 9.2, 'bold', PDF_COLORS.text, 1.14);
        y = drawLines(state, wrapText(doc, item.description, width, 8, 'normal'), x, y + 0.7, 8, 'normal', PDF_COLORS.muted, 1.22);
        setFont(doc, 7.4, 'normal', PDF_COLORS.light);
        doc.text(String(item.stars) + ' stars', x, y + 1.2);
        setColumnY(state, column, y + 5.3);
    }

    function drawReposSection(state, selectedKeys, key, column) {
        if (!hasSelected(selectedKeys, key)) return;
        var section = sectionByKey(key);
        drawSectionHeading(state, column, section.label);
        section.items.forEach(function (item) {
            drawRepoItem(state, item, column);
        });
    }

    function drawDeedyResume(state, selectedKeys) {
        drawHeader(state);

        state.leftY = state.initialY;
        drawEducation(state, selectedKeys);
        drawLinks(state);
        drawTagSection(state, selectedKeys, 'coursework', 'left');
        drawTagSection(state, selectedKeys, 'techstack', 'left');
        drawTagSection(state, selectedKeys, 'languages', 'left');

        setPdfPage(state, 1);
        state.rightY = state.initialY;
        drawTextSection(state, selectedKeys, 'about', 'right');
        drawTimelineSection(state, selectedKeys, 'experience', 'right');
        drawProjectSection(state, selectedKeys, 'freelance', 'right');
        drawReposSection(state, selectedKeys, 'opensource', 'right');
    }

    function selectedSections(selectedKeys) {
        var orderedSections = [];
        for (var i = 0; i < sectionOrder.length; i++) {
            var key = sectionOrder[i];
            if (selectedKeys.indexOf(key) === -1) continue;
            for (var j = 0; j < CV_DATA.sections.length; j++) {
                if (CV_DATA.sections[j].key === key) {
                    orderedSections.push(CV_DATA.sections[j]);
                    break;
                }
            }
        }
        return orderedSections;
    }

    function getJsPDFConstructor() {
        var root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : {});
        if (root.jspdf && root.jspdf.jsPDF) return root.jspdf.jsPDF;
        if (root.jsPDF) return root.jsPDF;
        if (root.jspdf && root.jspdf.default) return root.jspdf.default;
        return null;
    }

    function buildPdfDocument(selectedKeys) {
        var JsPDF = getJsPDFConstructor();
        if (!JsPDF) throw new Error('jsPDF non disponibile');

        var doc = new JsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait', compress: true });
        var state = createPdfState(doc);

        doc.setDocumentProperties({
            title: 'Tommaso Patriti CV',
            subject: 'Curriculum Vitae',
            author: CV_DATA.meta.name
        });

        drawDeedyResume(state, selectedKeys);
        return doc;
    }

    // --- Generazione PDF ---
    function generatePdf(selectedKeys) {
        return new Promise(function (resolve, reject) {
            try {
                var filename = 'Tommaso_Patriti_CV_' + cvLang.toUpperCase() + '.pdf';
                buildPdfDocument(selectedKeys).save(filename);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    if (typeof window !== 'undefined') {
        window.CV_EXPORTER = {
            buildPdfDocument: buildPdfDocument,
            generatePdf: generatePdf
        };
    }

    // --- Logica Modal ---
    function init() {
        var openBtn = document.getElementById('openCvModal');
        var modal = document.getElementById('cvModal');
        var closeBtn = document.getElementById('closeCvModal');
        var generateBtn = document.getElementById('cvGenerate');
        var selectAllBtn = document.getElementById('cvSelectAll');

        if (!openBtn || !modal) return;

        var allSelected = true;

        // --- Language picker nel modal ---
        var langBtns = modal.querySelectorAll('.cv-lang-btn');
        for (var lb = 0; lb < langBtns.length; lb++) {
            langBtns[lb].addEventListener('click', function () {
                for (var k = 0; k < langBtns.length; k++) {
                    langBtns[k].classList.remove('active');
                }
                this.classList.add('active');
                cvLang = this.dataset.cvLang;
            });
        }

        // Apri modal
        openBtn.addEventListener('click', function () {
            allSelected = true;
            cvLang = getSiteLang();
            // Attiva il bottone lingua corretto
            for (var k = 0; k < langBtns.length; k++) {
                langBtns[k].classList.toggle('active', langBtns[k].dataset.cvLang === cvLang);
            }
            renderSectionToggles();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        // Chiudi modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Seleziona/deseleziona tutto
        selectAllBtn.addEventListener('click', function () {
            allSelected = !allSelected;
            var checkboxes = modal.querySelectorAll('input[type="checkbox"]');
            for (var i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = allSelected;
            }
            var sl = getSiteLang();
            var span = selectAllBtn.querySelector('span');
            if (span) {
                if (allSelected) {
                    span.textContent = sl === 'it' ? 'Deseleziona tutto' : 'Deselect all';
                } else {
                    span.textContent = sl === 'it' ? 'Seleziona tutto' : 'Select all';
                }
            }
        });

        // Genera PDF
        generateBtn.addEventListener('click', function () {
            var checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
            var selectedKeys = [];
            for (var i = 0; i < checkboxes.length; i++) {
                selectedKeys.push(checkboxes[i].dataset.section);
            }

            if (selectedKeys.length === 0) return;

            var sl = getSiteLang();
            var btnSpan = generateBtn.querySelector('span');
            var btnIcon = generateBtn.querySelector('i, .cv-spinner');

            // Stato loading
            generateBtn.disabled = true;
            if (btnSpan) btnSpan.textContent = sl === 'it' ? 'Generazione...' : 'Generating...';
            if (btnIcon) {
                var spinner = document.createElement('div');
                spinner.className = 'cv-spinner';
                btnIcon.replaceWith(spinner);
                btnIcon = spinner;
            }

            function restoreGenerateButton() {
                generateBtn.disabled = false;
                if (btnSpan) btnSpan.textContent = sl === 'it' ? 'Scarica PDF' : 'Download PDF';
                if (btnIcon) {
                    var icon = document.createElement('i');
                    icon.setAttribute('data-lucide', 'download');
                    btnIcon.replaceWith(icon);
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
            }

            generatePdf(selectedKeys)
                .then(restoreGenerateButton)
                .catch(function (err) {
                    console.error('Errore generazione CV PDF:', err);
                    restoreGenerateButton();
                });
        });
    }

    // --- Avvio ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
